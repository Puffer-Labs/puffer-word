FROM docker.elastic.co/logstash/logstash:8.1.2
RUN bin/logstash-plugin install logstash-input-mongodb
RUN rm -f /usr/share/logstash/pipeline/logstash.conf
ADD pipeline/ /usr/share/logstash/pipeline/
ADD config/ /usr/share/logstash/config/
