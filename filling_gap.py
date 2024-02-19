import numpy as np
import pandas as pd

# Step 1: Read the CSV file and parse it into a pandas DataFrame
file_path = 'Phon_spening.csv'
df = pd.read_csv(file_path, index_col='Month')

# Step 2: Replace NaN values with random numbers between 100 and 300
random_values = np.random.randint(100, 301, size=df.shape)
df = df.fillna(pd.DataFrame(random_values, index=df.index, columns=df.columns))
print(df)

# Step 3: Save the modified DataFrame back to a CSV file
output_file_path = 'modified_csv_file.csv'
df.to_csv(output_file_path)

print(f"Modified DataFrame saved to {output_file_path}")