# line plot of time series
from pandas import read_csv
from matplotlib import pyplot
from statsmodels.tsa.arima_model import ARIMA
from pmdarima import auto_arima
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
import statsmodels.api as sm
import numpy as np
import sys

# load dataset
series = read_csv(sys.argv[1], header=0, index_col=0)
# series = read_csv('shampoo-sales.csv', header=0, index_col=0)

# display first few rows
print(series.head(20))
# line plot of dataset
# series.plot()
pyplot.show()


series = read_csv(sys.argv[1], header=0, index_col=0)
# series = read_csv('shampoo-sales.csv', header=0, index_col=0)

split_point = len(series) - 7
dataset, validation = series[0:split_point], series[split_point:]
# split_point = len(series) - 700
# dataset, validation = series[0:split_point], series[split_point: len(series) - 693]
print('Dataset %d, Validation %d' % (len(dataset), len(validation)))
dataset.to_csv('dataset.csv', index=False, header=False)
validation.to_csv('validation.csv', index=False, header=False)


def checkAccuracy():
	# Calculate performance
	# load dataset
	trainSet = read_csv('dataset.csv', header=None)
	testSet = read_csv('validation.csv', header=None)
	# seasonal difference
	X = trainSet.values
	Y = testSet.values

	# print(Y)
	# print(arima_pred)

	arima_rmse_error = rmse(Y, arima_pred)
	arima_mse_error = arima_rmse_error**2
	mean_value = X.mean()

	print(f'MSE Error: {arima_mse_error}\nRMSE Error: {arima_rmse_error}\nMape: {np.mean(np.abs((Y - arima_pred) / Y)) * 100}\nMean: {mean_value}')


### Arima
print('ARIMA')
# create a differenced series
def difference(dataset, interval=1):
    diff = list()
    for i in range(interval, len(dataset)):
        value = dataset[i] - dataset[i - interval]
        diff.append(value)
    return diff

# invert differenced value
def inverse_difference(history, yhat, interval=1):
	return yhat + history[-interval]

# load dataset
series = read_csv('dataset.csv', header=None)
# seasonal difference
X = series.values
days_in_year = 24
differenced = difference(X, days_in_year)
# fit model
model = ARIMA(differenced, order=(3,0,3))
model_fit = model.fit(disp=0)
# multi-step out-of-sample forecast
start_index = len(differenced)
end_index = start_index + 6
forecast = model_fit.predict(start=start_index, end=end_index)
# invert the differenced forecast to something usable
history = [x for x in X]
arima_pred = []
day = 1
for yhat in forecast:
	inverted = inverse_difference(history, yhat, days_in_year)
	print('Day %d: %f' % (day, inverted))
	history.append(inverted)
	arima_pred.append(inverted)
	day += 1
checkAccuracy()



###SARIMA
print('\n\n\n SARIMA')
series = read_csv('dataset.csv', header=None)
X = series.values
model = sm.tsa.statespace.SARIMAX(X, order=(3,0,3), seasonal_order=(0,0,0,0))
model_fit = model.fit(disp=0)

start_index = len(X)
end_index = start_index + 6
forecast = model_fit.predict(start=start_index, end=end_index)
history = [x for x in X]
arima_pred = []
day = 1
for yhat in forecast:
    print('Day %d: %f' % (day, yhat))
    history.append(yhat)
    arima_pred.append([yhat])
    day += 1
checkAccuracy()
