import pandas as pd
import numpy as np

data = pd.read_csv('Christian_spending.csv') #reads original spending csv
np.random.seed(999) #random seed
# I usually spend between 80-200 on dining not usually more or less than that
data['Dining'] = data['Dining'].fillna(pd.Series(np.random.randint(80, 200, size=len(data)))).astype(int)
# I usually spend between 200-400 on online shopping per month
data['Online Shopping'] = data['Online Shopping'].fillna(pd.Series(np.random.randint(200, 400, size=len(data)))).astype(int)
# for gas I usually spend like 70-160 depending on the month how much I will drive
data['Transportation'] = data['Transportation'].fillna(pd.Series(np.random.randint(70, 160, size=len(data)))).astype(int)
#for groceries monthly usually between 200 and 300
data['Grocery'] = data['Grocery'].fillna(pd.Series(np.random.randint(200, 300, size=len(data)))).astype(int)
#I dont really spend too much outside of these categories so between like 30-100 dollars
data['Everything else'] = data['Everything else'].fillna(pd.Series(np.random.randint(30, 100, size=len(data)))).astype(int)

#writes to new csv
data.to_csv('Christian_modified_spending.csv', index=False)