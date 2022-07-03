FROM node

RUN whoami
#RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
#RUN chmod a+r /usr/share/keyrings/docker-archive-keyring.gpg
RUN apt-get update
RUN apt-get -y upgrade
RUN mkdir suppy
WORKDIR suppy
RUN npm init --yes
RUN npm install apollo-server graphql pg
#RUN npm install -g forever

COPY index.js .
#RUN forever start index.js 
CMD node index.js