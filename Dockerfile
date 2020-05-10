FROM nikolaik/python-nodejs:python3.7-nodejs10

WORKDIR /tmp
COPY requirements.txt /tmp/requirements.txt
RUN pip install -r requirements.txt


# RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY package*.json ./

RUN npm cache clean --force && npm install

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "node", "app.js" ]