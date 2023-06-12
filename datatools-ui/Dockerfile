# We only need the dist and index.html from the build, the rest is extra weight to docker image
FROM node:14 as build

ENV VERSION=v5.0.0

RUN apt-get update && \
    apt-get install -y --no-install-recommends gettext-base && \
   apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm i -g serve

#RUN  git clone -b 'v4.1.0' --single-branch https://github.com/wkulesza/datatools-ui.git /opt/datatools-ui
#RUN git clone -b 'support-custom-tiles' --single-branch https://github.com/ibi-group/datatools-ui.git /opt/datatools-ui
#RUN git clone -b 'dev' --single-branch https://github.com/wkulesza/datatools-ui.git /opt/datatools-ui



ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN git clone -b 'devmerge' https://github.com/goeuropa/datatools-ui.git /opt/datatools-ui

WORKDIR /opt/datatools-ui

#current synchronised branch
#RUN git checkout b240cb6f0a8d809f18bae8315a610e8af921ca0a
#RUN git checkout 98519e6c300700eaaef470b05828f18e8c844486

ADD ./config/*.yml /config/

#RUN yarn

COPY /config/settings.yml /opt/datatools-ui/configurations/default/settings.yml
COPY /config/auth.pem /opt/datatools-ui/configurations/default/auth.pem
COPY /config/env.yml /opt/datatools-ui/configurations/default/env.yml

#CMD envsubst < /config/env.yml > /opt/datatools-ui/configurations/default/env.yml && \
#    $(npm bin)/mastarm build --env production 
#CMD npm mastarm build --env production 
#RUN npm install
#RUN npm cache clean --force
#RUN npm run build --env production
#RUN yarn build
RUN yarn install
RUN yarn run build -- --minify

add . / 
FROM jitesoft/lighttpd:latest

EXPOSE 4000
#ssl
# Copy your SSL certificate and key
COPY config/cert.pem /etc/lighttpd/ssl.crt
COPY config/privkey.pem /etc/lighttpd/ssl.key

# Configure lighttpd for HTTPS
RUN echo 'server.modules += ("mod_openssl")' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.engine = "enable"' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.pemfile = "/etc/lighttpd/ssl.crt"' >> /etc/lighttpd/lighttpd.conf
RUN echo 'ssl.privkey = "/etc/lighttpd/ssl.key"' >> /etc/lighttpd/lighttpd.conf


RUN mkdir -p /var/www/html/dist

COPY --from=build /opt/datatools-ui/index.html /var/www/html/
COPY --from=build /opt/datatools-ui/dist /var/www/html/dist
COPY /lighthttp/rewrite.conf /etc/lighttpd/conf.d/
