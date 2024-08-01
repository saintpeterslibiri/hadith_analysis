import pandas as pd
import numpy as np
import torch
from transformers import AutoTokenizer, AutoModel
from sklearn.metrics.pairwise import cosine_similarity
import time

# Define normalization function
def normalize(input):
    input = input.replace("\u0610", "").replace("\u0611", "").replace("\u0612", "").replace("\u0613", "").replace("\u0614", "")\
        .replace("\u0615", "").replace("\u0616", "").replace("\u0617", "").replace("\u0618", "").replace("\u0619", "").replace("\u061A", "")\
        .replace("\u06D6", "").replace("\u06D7", "").replace("\u06D8", "").replace("\u06D9", "").replace("\u06DA", "").replace("\u06DB", "")\
        .replace("\u06DC", "").replace("\u06DD", "").replace("\u06DE", "").replace("\u06DF", "").replace("\u06E0", "").replace("\u06E1", "")\
        .replace("\u06E2", "").replace("\u06E3", "").replace("\u06E4", "").replace("\u06E5", "").replace("\u06E6", "").replace("\u06E7", "")\
        .replace("\u06E8", "").replace("\u06E9", "").replace("\u06EA", "").replace("\u06EB", "").replace("\u06EC", "").replace("\u06ED", "")\
        .replace("\u0640", "")\
        .replace("\u064B", "").replace("\u064C", "").replace("\u064D", "").replace("\u064E", "").replace("\u064F", "").replace("\u0650", "")\
        .replace("\u0651", "").replace("\u0652", "").replace("\u0653", "").replace("\u0654", "").replace("\u0655", "").replace("\u0656", "")\
        .replace("\u0657", "").replace("\u0658", "").replace("\u0659", "").replace("\u065A", "").replace("\u065B", "").replace("\u065C", "")\
        .replace("\u065D", "").replace("\u065E", "").replace("\u065F", "").replace("\u0670", "")\
        .replace("[إأآا]", "ا").replace("ى", "ي").replace("ؤ", "ء").replace("ئ", "ء").replace("ة", "ه").replace("گ", "ك")
    return input

# Load pre-trained Arabic BERT model
model_name = "CAMeL-Lab/bert-base-arabic-camelbert-mix"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModel.from_pretrained(model_name)

def embed_text(texts, batch_size=16, max_length=128):
    embeddings = []
    for i in range(0, len(texts), batch_size):
        batch_texts = texts[i:i + batch_size]
        inputs = tokenizer(batch_texts, return_tensors='pt', truncation=True, padding=True, max_length=max_length)
        with torch.no_grad():
            outputs = model(**inputs)
        batch_embeddings = outputs.last_hidden_state.mean(dim=1).cpu().numpy()
        embeddings.append(batch_embeddings)
    return np.concatenate(embeddings, axis=0)

# Load Hadiths from CSV file
file_path = 'hadiths.csv' 
hadiths_df = pd.read_csv(file_path)

# Extract and normalize Arabic texts
arabic_texts = hadiths_df['arabic'].apply(normalize).tolist()
hadith_ids = hadiths_df['id'].tolist()
hadith_chains = hadiths_df['chain'].tolist()

# Split the data into smaller chunks to manage memory efficiently
chunk_size = 5000 
all_embeddings = []

# Add checkpoint for embedding process
total_chunks = (len(arabic_texts) + chunk_size - 1) // chunk_size
for chunk_index, start in enumerate(range(0, len(arabic_texts), chunk_size), 1):
    end = min(start + chunk_size, len(arabic_texts))
    chunk_texts = arabic_texts[start:end]
    chunk_embeddings = embed_text(chunk_texts)
    all_embeddings.append(chunk_embeddings)
    
    print(f"Processed chunk {chunk_index}/{total_chunks}")

# Concatenate all embeddings
all_embeddings = np.concatenate(all_embeddings, axis=0)

# Calculate cosine similarity matrix in chunks to save memory
threshold = 0.98
similar_pairs = []

total_comparisons = (len(all_embeddings) + chunk_size - 1) // chunk_size
comparison_count = 0
start_time = time.time()

for i in range(0, len(all_embeddings), chunk_size):
    for j in range(i, len(all_embeddings), chunk_size):
        if i == j:
            similarity_chunk = cosine_similarity(all_embeddings[i:i+chunk_size])
            indices = np.argwhere(similarity_chunk > threshold)
            for index in indices:
                if index[0] != index[1]:  # Avoid self-pairs
                    similar_pairs.append((i+index[0], i+index[1], similarity_chunk[index[0], index[1]]))
        else:
            similarity_chunk = cosine_similarity(all_embeddings[i:i+chunk_size], all_embeddings[j:j+chunk_size])
            indices = np.argwhere(similarity_chunk > threshold)
            for index in indices:
                similar_pairs.append((i+index[0], j+index[1], similarity_chunk[index[0], index[1]]))
        
        comparison_count += 1
        if comparison_count % 10 == 0:  # Print progress every 10 comparisons
            elapsed_time = time.time() - start_time
            progress = comparison_count / total_comparisons
            estimated_total_time = elapsed_time / progress
            estimated_remaining_time = estimated_total_time - elapsed_time
            print(f"Progress: {progress:.2%} | Estimated time remaining: {estimated_remaining_time/60:.2f} minutes")

# # Display similar pairs with Hadith IDs
# for pair in similar_pairs:
#     index1, index2, similarity = pair
#     print(f"Hadith 1 ID: {hadith_ids[index1]}")
#     print(f"Hadith 2 ID: {hadith_ids[index2]}")
#     print(f"Similarity Score: {similarity:.2f}")
#     print(f"Hadith 1: {arabic_texts[index1]}")
#     print(f"Hadith 2: {arabic_texts[index2]}")
#     print(f"Hadith 1 Chain: {hadith_chains[index1]}")
#     print(f"Hadith 2 Chain: {hadith_chains[index2]}")
#     print()

# Save results to a file
output_file = 'similar_hadiths.csv'
with open(output_file, 'w', encoding='utf-8') as f:
    f.write("Similarity,Hadith1_ID,Hadith2_ID,Hadith1_Chain,Hadith2_Chain\n")
    for pair in similar_pairs:
        index1, index2, similarity = pair
        f.write(f"{similarity:.2f},{hadith_ids[index1]},{hadith_ids[index2]},\"{hadith_chains[index1]}\",\"{hadith_chains[index2]}\"\n")

print(f"Results saved to {output_file}")