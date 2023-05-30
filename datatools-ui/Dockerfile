FROM node:14

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
RUN git clone -b 'mapa' https://github.com/goeuropa/datatools-ui.git /opt/datatools-ui

WORKDIR /opt/datatools-ui

#current synchronised branch
#RUN git checkout b240cb6f0a8d809f18bae8315a610e8af921ca0a
#RUN git checkout 98519e6c300700eaaef470b05828f18e8c844486

ADD ./config/*.yml /config/

RUN yarn

COPY /config/settings.yml /opt/datatools-ui/configurations/default/settings.yml
#COPY /config/auth.pem /opt/datatools-ui/configurations/default/auth.pem

EXPOSE 9966

CMD envsubst < /config/env.yml > /opt/datatools-ui/configurations/default/env.yml && \
    $(npm bin)/mastarm build --env production && serve -p 9966
