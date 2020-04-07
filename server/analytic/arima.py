# line plot of time series
from pandas import read_csv
from statsmodels.tsa.arima_model import ARIMA
from pmdarima import auto_arima
from sklearn.metrics import mean_squared_error
from statsmodels.tools.eval_measures import rmse
import statsmodels.api as sm
import numpy as np
import sys

# load dataset
series = read_csv(sys.argv[1], header=0, index_col=0)


series = read_csv(sys.argv[1], header=0, index_col=0)
dataset = series[:]
dataset.to_csv('./server/analytic/data/dataset.csv', index=False, header=False)


series = read_csv('./server/analytic/data/dataset.csv', header=None)
X = series.values
model = sm.tsa.statespace.SARIMAX(X, order=(2,0,2), seasonal_order=(2,1,2,12))
model_fit = model.fit(disp=0)

start_index = len(X)
end_index = start_index + 23
forecast = model_fit.predict(start=start_index, end=end_index)
history = [x for x in X]
arima_pred = []
day = 1
for yhat in forecast:
    # print('Hour %d: %f' % (day, yhat))
    print('%f' % yhat)
    history.append(yhat)
    arima_pred.append([yhat])
    day += 1