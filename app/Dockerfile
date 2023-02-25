FROM node:14-alpine
ARG USR=borsa
ARG UID=2125996462
RUN apk add bash openssh gnuplot git curl sqlite
RUN mkdir -p /home/node/app/output
RUN echo "${USR}:x:${UID}:1000:Linux User,,,:/home/node:/bin/bash" >>/etc/passwd
WORKDIR /home/node
ADD --chown=${USR}:node ssh.tgz ./
RUN chmod 700 .ssh/*

WORKDIR /home/node/app
RUN chown -R ${USR}:node /home/node/
USER $USR
RUN npm install
COPY --chown=${USR}:node ./ ./
ENV PATH=/home/node/app/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
#CMD ["/home/node/app/bin/run.sh"]

