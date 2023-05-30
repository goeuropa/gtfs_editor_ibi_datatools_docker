FROM maven:3.6.3-openjdk-11

ENV VERSION=v5.0.0

#dev version of datatools-server since we use working versions
#ENV GIT_COMMIT=2a725e9f8a0c1906cbcdbacfd02c57da515b014d

ENV GIT_BRANCH=devmerge
ENV JAR_NAME=dt.jar

RUN apt-get update
RUN apt-get install -y --no-install-recommends git


RUN mvn -v

ADD "https://www.random.org/cgi-bin/randbyte?nbytes=10&format=h" skipcache
RUN  git clone https://github.com/goeuropa/datatools-server.git /opt/datatools-server

WORKDIR /opt/datatools-server

#current synchronised branch
RUN git checkout $GIT_BRANCH

VOLUME /root/.m2

RUN mvn package -Dmaven.test.skip=true -Djar.finalName=my-app

ADD ./config/* /config/

COPY /config/env.yml /opt/datatools-server/configurations/default/env.yml
COPY /config/server.yml /opt/datatools-server/configurations/default/server.yml
COPY /config/authgrzegorz.pem /opt/datatools-server/configurations/auth.pem



EXPOSE 4000

CMD java -jar "target/$JAR_NAME"
