- [Big Query Notes for Kubernetes Charts](#sec-1)
  - [Exploring a single 24 hours period](#sec-1-1)
    - [Query: Count the times does the 'created' permission get used?](#sec-1-1-1)
    - [Query: Package/Permission count](#sec-1-1-2)
    - [Locate Bucket information](#sec-1-1-3)
    - [Query: Which user agent is making the most requests?](#sec-1-1-4)
  - [References](#sec-1-2)
  - [Schema](#sec-1-3)
  - [Testing various ideas/queries with console.cloud.google.com/bigquery](#sec-1-4)
  - [Data Insights](#sec-1-5)
  - [Insights: ResourceNames](#sec-1-6)


# Big Query Notes for Kubernetes Charts<a id="sec-1"></a>

You need bigquery access to kubernetes-charts. Details on installing can be found at [Install the Google Cloud: SDK Quickstart for Debian and Ubuntu](https://cloud.google.com/sdk/docs/quickstart-debian-ubuntu)

The 'bq' command is used to query various datasets. Details can be found at [Using the bq Command-Line Tool](https://cloud.google.com/bigquery/docs/bq-command-line-tool)

## Exploring a single 24 hours period<a id="sec-1-1"></a>

The data seems to be rolled up into 48 blocks that are hit every 30 minutes over a 24 hour period.

### Query: Count the times does the 'created' permission get used?<a id="sec-1-1-1"></a>

Most of the packages are hit every 30 minutes, at either 25 or 55 past the hour

```shell
SELECT DISTINCT authorizationInfo.resource AS resource, COUNT(authorizationInfo.resource) AS count
FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
     UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
WHERE authorizationInfo.permission = 'storage.objects.create'
GROUP BY authorizationInfo.resource
ORDER BY count DESC, authorizationInfo.resource
```

    
    +---------------------------------------------------------------------------------------|-------+
    |                                       resource                                        | count |
    +---------------------------------------------------------------------------------------|-------+
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ee-0.2.2.tgz                      |    49 |
    | projects/_/buckets/kubernetes-charts/objects/acs-engine-autoscaler-2.2.0.tgz          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aerospike-0.1.7.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/anchore-engine-0.9.0.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/apm-server-0.1.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-7.3.1.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-ha-0.4.1.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/auditbeat-0.3.1.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aws-cluster-autoscaler-0.3.3.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bitcoind-0.1.3.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bookstack-0.1.2.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/buildkite-0.2.4.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/burrow-0.4.5.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/centrifugo-2.0.1.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cerebro-0.4.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chaoskube-0.10.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chartmuseum-1.6.2.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chronograf-0.4.5.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cluster-autoscaler-0.9.0.tgz             |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cockroachdb-2.0.6.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/concourse-3.0.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/consul-3.4.2.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coredns-1.1.3.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cosbench-1.0.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coscale-0.2.1.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-1.1.0.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-distributed-2.0.2.tgz               |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dex-0.5.0.tgz                            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distributed-tensorflow-0.1.1.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distribution-0.4.2.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dmarc2logstash-1.0.2.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/docker-registry-1.6.1.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dokuwiki-4.0.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drone-1.7.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drupal-3.0.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/efs-provisioner-0.1.1.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastabot-1.1.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastalert-0.9.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastic-stack-1.1.0.tgz                  |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-1.14.0.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-curator-1.0.1.tgz          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-exporter-0.4.1.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/envoy-1.1.2.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/etcd-operator-0.8.0.tgz                  |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ethereum-0.1.4.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/eventrouter-0.2.0.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/express-gateway-1.0.1.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/external-dns-1.0.2.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/factorio-0.3.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/falco-0.5.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/filebeat-1.0.4.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluent-bit-0.16.1.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-1.0.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-elasticsearch-1.3.0.tgz          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/g2-0.3.3.tgz                             |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gce-ingress-1.0.0.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-endpoints-0.1.2.tgz               |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-sqlproxy-0.6.0.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcp-night-king-1.0.2.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ghost-6.0.0.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ce-0.2.2.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gocd-1.5.6.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/grafana-1.18.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hackmd-0.1.1.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hadoop-1.0.8.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hazelcast-1.0.1.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heapster-0.3.2.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heartbeat-0.1.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hl-composer-1.0.10.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ca-1.1.3.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-couchdb-1.0.5.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ord-1.2.2.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-peer-1.2.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/home-assistant-0.4.1.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/horovod-1.0.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hubot-0.0.1.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/inbucket-2.0.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/index.yaml                               |    48 |
    | projects/_/buckets/kubernetes-charts/objects/influxdb-0.12.1.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ingressmonitorcontroller-1.0.47.tgz      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ipfs-0.2.2.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/janusgraph-0.2.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jasperreports-4.0.0.tgz                  |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jenkins-0.22.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/joomla-4.0.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/k8s-spot-rescheduler-0.4.0.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kanister-operator-0.3.0.tgz              |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kapacitor-1.1.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/karma-1.1.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/katafygio-0.4.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keel-0.6.0.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keycloak-4.0.4.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kiam-2.0.0-rc3.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kong-0.6.3.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-hunter-1.0.1.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-lego-0.4.2.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-ops-view-0.4.3.tgz                  |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-slack-0.4.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-state-metrics-0.11.0.tgz            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube2iam-0.9.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubed-0.3.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubedb-0.1.3.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubernetes-dashboard-0.8.0.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kuberos-0.2.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubewatch-0.5.2.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kured-0.1.1.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/lamp-0.1.5.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/linkerd-0.4.1.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/locust-0.3.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/logstash-1.3.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/luigi-2.7.4.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magento-4.0.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-ip-address-0.1.0.tgz               |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-namespace-0.3.0.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mailhog-2.3.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mariadb-5.2.3.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mattermost-team-edition-1.3.0.tgz        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mcrouter-0.1.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mediawiki-6.0.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/memcached-2.3.1.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metabase-0.4.3.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metallb-0.8.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metricbeat-0.3.3.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metrics-server-2.0.4.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minecraft-0.3.1.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minio-1.9.1.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mission-control-0.4.3.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-4.9.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-replicaset-3.6.4.tgz             |    48 |
    | projects/_/buckets/kubernetes-charts/objects/moodle-4.0.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/msoms-0.2.0.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mssql-linux-0.6.2.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysql-0.10.2.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysqldump-1.0.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/namerd-0.2.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/neo4j-0.8.0.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/newrelic-infrastructure-0.7.0.tgz        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-client-provisioner-1.2.0.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-server-provisioner-0.2.1.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ingress-0.31.0.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ldapauth-proxy-0.1.2.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-lego-0.3.1.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-problem-detector-1.0.tgz            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-red-1.0.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/oauth2-proxy-0.6.0.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openebs-0.7.2.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openiban-1.0.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openldap-0.2.4.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openvpn-3.10.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/orangehrm-4.0.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/pachyderm-0.1.8.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/percona-0.3.3.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/percona-xtradb-cluster-0.6.0.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/phpmyadmin-1.3.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/presto-0.1.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-7.4.4.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-adapter-v0.2.0.tgz            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-blackbox-exporter-0.2.0.tgz   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-cloudwatch-exporter-0.2.1.tgz |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-couchdb-exporter-0.1.0.tgz    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-mysql-exporter-0.2.1.tgz      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-node-exporter-0.5.1.tgz       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-operator-0.1.25.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-postgres-exporter-0.5.0.tgz   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-pushgateway-0.2.0.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-rabbitmq-exporter-0.1.4.tgz   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-redis-exporter-0.3.4.tgz      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-to-sd-0.1.1.tgz               |    48 |
    | projects/_/buckets/kubernetes-charts/objects/quassel-0.2.9.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-ha-1.14.0.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-4.2.10.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-ha-3.0.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rethinkdb-0.2.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/risk-advisor-2.0.4.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rocketchat-0.1.5.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rookout-0.1.0.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sapho-0.2.2.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/schema-registry-ui-0.1.0.tgz             |    48 |
    | projects/_/buckets/kubernetes-charts/objects/searchlight-0.3.3.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/selenium-0.12.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sematext-docker-agent-0.2.0.tgz          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sensu-0.2.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sentry-0.5.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/seq-0.1.1.tgz                            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalfx-agent-0.3.0.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalsciences-0.0.1.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonarqube-0.10.1.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonatype-nexus-1.14.1.tgz                |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-0.2.1.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-history-server-0.2.0.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spartakus-1.1.5.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spinnaker-1.1.6.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spotify-docker-gc-0.3.0.tgz              |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spring-cloud-data-flow-1.0.0.tgz         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stackdriver-exporter-0.0.4.tgz           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stash-0.5.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stellar-core-1.0.0.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stolon-0.4.4.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sumokube-0.1.4.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sumologic-fluentd-0.6.0.tgz              |    48 |
    | projects/_/buckets/kubernetes-charts/objects/superset-1.0.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/swift-0.6.3.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sysdig-1.2.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/telegraf-0.3.3.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-notebook-0.1.2.tgz            |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-serving-0.1.2.tgz             |    48 |
    | projects/_/buckets/kubernetes-charts/objects/terracotta-1.0.0.tgz                     |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tomcat-0.1.0.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/traefik-1.53.0.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/uchiwa-0.2.7.tgz                         |    48 |
    | projects/_/buckets/kubernetes-charts/objects/unbound-0.1.2.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/unifi-0.2.1.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/vault-operator-0.1.1.tgz                 |    48 |
    | projects/_/buckets/kubernetes-charts/objects/verdaccio-0.5.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/voyager-3.2.4.tgz                        |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-cloud-0.3.0.tgz                    |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-scope-0.10.0.tgz                   |    48 |
    | projects/_/buckets/kubernetes-charts/objects/wordpress-4.0.0.tgz                      |    48 |
    | projects/_/buckets/kubernetes-charts/objects/xray-0.4.2.tgz                           |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zeppelin-1.0.1.tgz                       |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zetcd-0.1.9.tgz                          |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.3.tgz                            |    46 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.4.tgz                       |    46 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.1.0.tgz                         |    46 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.2.tgz                       |    36 |
    | projects/_/buckets/kubernetes-charts/objects/parse-5.0.0.tgz                          |    31 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-4.0.0.tgz                        |    30 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-4.0.0.tgz                          |    30 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.1.0.tgz                |    29 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-5.0.0.tgz                           |    29 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-4.0.0.tgz                       |    29 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.3.tgz                     |    29 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-4.0.0.tgz                       |    28 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-4.0.0.tgz                    |    28 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.19.0.tgz                        |    27 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.1.tgz                  |    26 |
    | projects/_/buckets/kubernetes-charts/objects/nats-1.3.1.tgz                           |    25 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-5.0.0.tgz                     |    25 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-3.6.3.tgz                       |    25 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-6.0.2.tgz                        |    24 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-7.0.0.tgz                        |    24 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-4.1.0.tgz                       |    24 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-5.0.0.tgz                       |    24 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-3.2.0.tgz                       |    24 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-4.0.0.tgz                       |    24 |
    | projects/_/buckets/kubernetes-charts/objects/nats-2.0.0.tgz                           |    23 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-4.1.1.tgz                     |    23 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-4.0.0.tgz                       |    23 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.2.tgz                  |    22 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.20.0.tgz                        |    21 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-3.3.1.tgz                       |    20 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-3.3.4.tgz                    |    20 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.0.2.tgz                |    19 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-4.0.2.tgz                           |    19 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-3.2.0.tgz                       |    19 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.2.tgz                     |    19 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-3.2.0.tgz                        |    18 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-3.2.1.tgz                          |    18 |
    | projects/_/buckets/kubernetes-charts/objects/parse-4.0.0.tgz                          |    17 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.11.0.tgz                       |    11 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.2.tgz                            |     2 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.3.tgz                       |     2 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.0.0.tgz                         |     2 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.3.tgz                       |     1 |
    +---------------------------------------------------------------------------------------|-------+

### Query: Package/Permission count<a id="sec-1-1-2"></a>

How many times does each permission get used on a package?

```shell
SELECT DISTINCT
protopayload_auditlog.resourceName,
authorizationInfo.permission,
COUNT (authorizationInfo.permission) AS count
FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
     UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
GROUP BY
         protopayload_auditlog.resourceName,
         authorizationInfo.permission
ORDER BY protopayload_auditlog.resourceName
```

    
    +--------------------------------------------------------------------------------------------------|------------------------|-------+
    |                                           resourceName                                           |       permission       | count |
    +--------------------------------------------------------------------------------------------------|------------------------|-------+
    | projects/_/buckets/kubernetes-charts/objects/acs-engine-autoscaler-2.2.0.tgz                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/acs-engine-autoscaler-2.2.0.tgz                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aerospike-0.1.7.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aerospike-0.1.7.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/anchore-engine-0.9.0.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/anchore-engine-0.9.0.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/apm-server-0.1.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/apm-server-0.1.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.2.tgz                                       | storage.objects.delete |     2 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.2.tgz                                       | storage.objects.create |     2 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.3.tgz                                       | storage.objects.delete |    46 |
    | projects/_/buckets/kubernetes-charts/objects/ark-1.2.3.tgz                                       | storage.objects.create |    46 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-7.3.1.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-7.3.1.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-ha-0.4.1.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/artifactory-ha-0.4.1.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/auditbeat-0.3.1.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/auditbeat-0.3.1.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aws-cluster-autoscaler-0.3.3.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/aws-cluster-autoscaler-0.3.3.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bitcoind-0.1.3.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bitcoind-0.1.3.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bookstack-0.1.2.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/bookstack-0.1.2.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/buildkite-0.2.4.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/buildkite-0.2.4.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/burrow-0.4.5.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/burrow-0.4.5.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/centrifugo-2.0.1.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/centrifugo-2.0.1.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cerebro-0.4.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cerebro-0.4.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.1.tgz                             | storage.objects.delete |    26 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.1.tgz                             | storage.objects.create |    26 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.2.tgz                             | storage.objects.create |    22 |
    | projects/_/buckets/kubernetes-charts/objects/cert-manager-v0.5.2.tgz                             | storage.objects.delete |    22 |
    | projects/_/buckets/kubernetes-charts/objects/chaoskube-0.10.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chaoskube-0.10.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chartmuseum-1.6.2.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chartmuseum-1.6.2.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/charts/bff-identity-0.1.0.tgz                       | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/charts/bff-identity-0.1.0.tgz                       | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/charts/rabbitmq-0.1.0.tgz                           | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/charts/rabbitmq-0.1.0.tgz                           | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/chronograf-0.4.5.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/chronograf-0.4.5.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cluster-autoscaler-0.9.0.tgz                        | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cluster-autoscaler-0.9.0.tgz                        | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cockroachdb-2.0.6.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cockroachdb-2.0.6.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/concourse-3.0.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/concourse-3.0.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/consul-3.4.2.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/consul-3.4.2.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coredns-1.1.3.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coredns-1.1.3.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cosbench-1.0.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/cosbench-1.0.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coscale-0.2.1.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/coscale-0.2.1.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-1.1.0.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-1.1.0.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-distributed-2.0.2.tgz                          | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dask-distributed-2.0.2.tgz                          | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.2.tgz                                  | storage.objects.create |    36 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.2.tgz                                  | storage.objects.delete |    36 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.3.tgz                                  | storage.objects.delete |     1 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.10.3.tgz                                  | storage.objects.create |     1 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.11.0.tgz                                  | storage.objects.delete |    11 |
    | projects/_/buckets/kubernetes-charts/objects/datadog-1.11.0.tgz                                  | storage.objects.create |    11 |
    | projects/_/buckets/kubernetes-charts/objects/dex-0.5.0.tgz                                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dex-0.5.0.tgz                                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distributed-tensorflow-0.1.1.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distributed-tensorflow-0.1.1.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distribution-0.4.2.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/distribution-0.4.2.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dmarc2logstash-1.0.2.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dmarc2logstash-1.0.2.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/docker-registry-1.6.1.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/docker-registry-1.6.1.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dokuwiki-4.0.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/dokuwiki-4.0.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drone-1.7.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drone-1.7.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drupal-3.0.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/drupal-3.0.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/efs-provisioner-0.1.1.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/efs-provisioner-0.1.1.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastabot-1.1.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastabot-1.1.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastalert-0.9.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastalert-0.9.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastic-stack-1.1.0.tgz                             | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elastic-stack-1.1.0.tgz                             | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-1.14.0.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-1.14.0.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-curator-1.0.1.tgz                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-curator-1.0.1.tgz                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-exporter-0.4.1.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/elasticsearch-exporter-0.4.1.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/envoy-1.1.2.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/envoy-1.1.2.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.0.tgz                  | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.0.tgz                  | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.1-ereneci.d4ac463.tgz  | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.1-ereneci.d4ac463.tgz  | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.1.tgz                  | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifchecker-2.0.1.tgz                  | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifsender-1.0.4-ereneci.ebad926.tgz   | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifsender-1.0.4-ereneci.ebad926.tgz   | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifsender-1.0.4.tgz                   | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-5g-notifsender-1.0.4.tgz                   | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ediegra.caa32e5.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ediegra.caa32e5.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ereneci.69af619.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ereneci.69af619.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ereneci.caa32e5.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6-ereneci.caa32e5.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6.tgz                          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.6.tgz                          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.5737be0.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.5737be0.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.639e738.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.639e738.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.800dc4c.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-commons-0.5.7-ereneci.800dc4c.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ediegra.caa32e5.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ediegra.caa32e5.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ereneci.69af619.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ereneci.69af619.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ereneci.caa32e5.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6-ereneci.caa32e5.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6.tgz                          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.6.tgz                          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.5737be0.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.5737be0.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.639e738.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.639e738.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.800dc4c.tgz          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-release-0.5.7-ereneci.800dc4c.tgz          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ediegra.caa32e5.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ediegra.caa32e5.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ereneci.69af619.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ereneci.69af619.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ereneci.caa32e5.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6-ereneci.caa32e5.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6.tgz                        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.6.tgz                        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.5737be0.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.5737be0.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.639e738.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.639e738.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.800dc4c.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/eric-udr-testtools-0.5.7-ereneci.800dc4c.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/etcd-operator-0.8.0.tgz                             | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/etcd-operator-0.8.0.tgz                             | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ethereum-0.1.4.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ethereum-0.1.4.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/eventrouter-0.2.0.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/eventrouter-0.2.0.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/express-gateway-1.0.1.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/express-gateway-1.0.1.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/external-dns-1.0.2.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/external-dns-1.0.2.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/factorio-0.3.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/factorio-0.3.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/falco-0.5.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/falco-0.5.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/filebeat-1.0.4.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/filebeat-1.0.4.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluent-bit-0.16.1.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluent-bit-0.16.1.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-1.0.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-1.0.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-elasticsearch-1.3.0.tgz                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/fluentd-elasticsearch-1.3.0.tgz                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/g2-0.3.3.tgz                                        | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/g2-0.3.3.tgz                                        | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gce-ingress-1.0.0.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gce-ingress-1.0.0.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-endpoints-0.1.2.tgz                          | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-endpoints-0.1.2.tgz                          | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-sqlproxy-0.6.0.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcloud-sqlproxy-0.6.0.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcp-night-king-1.0.2.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gcp-night-king-1.0.2.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ghost-6.0.0.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ghost-6.0.0.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ce-0.2.2.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ce-0.2.2.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ee-0.2.2.tgz                                 | storage.objects.create |    49 |
    | projects/_/buckets/kubernetes-charts/objects/gitlab-ee-0.2.2.tgz                                 | storage.objects.delete |    49 |
    | projects/_/buckets/kubernetes-charts/objects/gocd-1.5.6.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/gocd-1.5.6.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/grafana-1.18.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/grafana-1.18.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.3.tgz                                  | storage.objects.delete |     2 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.3.tgz                                  | storage.objects.create |     2 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.4.tgz                                  | storage.objects.create |    46 |
    | projects/_/buckets/kubernetes-charts/objects/graphite-0.1.4.tgz                                  | storage.objects.delete |    46 |
    | projects/_/buckets/kubernetes-charts/objects/hackmd-0.1.1.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hackmd-0.1.1.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hadoop-1.0.8.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hadoop-1.0.8.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hazelcast-1.0.1.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hazelcast-1.0.1.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heapster-0.3.2.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heapster-0.3.2.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heartbeat-0.1.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/heartbeat-0.1.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hl-composer-1.0.10.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hl-composer-1.0.10.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ca-1.1.3.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ca-1.1.3.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-couchdb-1.0.5.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-couchdb-1.0.5.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ord-1.2.2.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-ord-1.2.2.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-peer-1.2.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hlf-peer-1.2.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/home-assistant-0.4.1.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/home-assistant-0.4.1.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/horovod-1.0.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/horovod-1.0.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hubot-0.0.1.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/hubot-0.0.1.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/inbucket-2.0.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/inbucket-2.0.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/influxdb-0.12.1.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/influxdb-0.12.1.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ingressmonitorcontroller-1.0.47.tgz                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ingressmonitorcontroller-1.0.47.tgz                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ipfs-0.2.2.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ipfs-0.2.2.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.0.2.tgz                           | storage.objects.delete |    19 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.0.2.tgz                           | storage.objects.create |    19 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.1.0.tgz                           | storage.objects.create |    29 |
    | projects/_/buckets/kubernetes-charts/objects/jaeger-operator-1.1.0.tgz                           | storage.objects.delete |    29 |
    | projects/_/buckets/kubernetes-charts/objects/janusgraph-0.2.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/janusgraph-0.2.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jasperreports-4.0.0.tgz                             | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jasperreports-4.0.0.tgz                             | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jenkins-0.22.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/jenkins-0.22.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/joomla-4.0.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/joomla-4.0.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/k8s-spot-rescheduler-0.4.0.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/k8s-spot-rescheduler-0.4.0.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kanister-operator-0.3.0.tgz                         | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kanister-operator-0.3.0.tgz                         | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kapacitor-1.1.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kapacitor-1.1.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/karma-1.1.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/karma-1.1.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/katafygio-0.4.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/katafygio-0.4.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keel-0.6.0.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keel-0.6.0.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keycloak-4.0.4.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/keycloak-4.0.4.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kiam-2.0.0-rc3.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kiam-2.0.0-rc3.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.19.0.tgz                                   | storage.objects.delete |    27 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.19.0.tgz                                   | storage.objects.create |    27 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.20.0.tgz                                   | storage.objects.create |    21 |
    | projects/_/buckets/kubernetes-charts/objects/kibana-0.20.0.tgz                                   | storage.objects.delete |    21 |
    | projects/_/buckets/kubernetes-charts/objects/kong-0.6.3.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kong-0.6.3.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-hunter-1.0.1.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-hunter-1.0.1.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-lego-0.4.2.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-lego-0.4.2.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-ops-view-0.4.3.tgz                             | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-ops-view-0.4.3.tgz                             | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-slack-0.4.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-slack-0.4.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-state-metrics-0.11.0.tgz                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube-state-metrics-0.11.0.tgz                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube2iam-0.9.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kube2iam-0.9.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubed-0.3.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubed-0.3.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubedb-0.1.3.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubedb-0.1.3.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubernetes-dashboard-0.8.0.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubernetes-dashboard-0.8.0.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kuberos-0.2.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kuberos-0.2.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubewatch-0.5.2.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kubewatch-0.5.2.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kured-0.1.1.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/kured-0.1.1.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/lamp-0.1.5.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/lamp-0.1.5.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/linkerd-0.4.1.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/linkerd-0.4.1.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/locust-0.3.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/locust-0.3.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/logstash-1.3.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/logstash-1.3.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/luigi-2.7.4.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/luigi-2.7.4.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magento-4.0.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magento-4.0.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-ip-address-0.1.0.tgz                          | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-ip-address-0.1.0.tgz                          | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-namespace-0.3.0.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/magic-namespace-0.3.0.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mailhog-2.3.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mailhog-2.3.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mariadb-5.2.3.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mariadb-5.2.3.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mattermost-team-edition-1.3.0.tgz                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mattermost-team-edition-1.3.0.tgz                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mcrouter-0.1.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mcrouter-0.1.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mediawiki-6.0.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mediawiki-6.0.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/memcached-2.3.1.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/memcached-2.3.1.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metabase-0.4.3.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metabase-0.4.3.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metallb-0.8.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metallb-0.8.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metricbeat-0.3.3.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metricbeat-0.3.3.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metrics-server-2.0.4.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/metrics-server-2.0.4.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minecraft-0.3.1.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minecraft-0.3.1.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minio-1.9.1.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/minio-1.9.1.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mission-control-0.4.3.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mission-control-0.4.3.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-4.9.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-4.9.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-replicaset-3.6.4.tgz                        | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mongodb-replicaset-3.6.4.tgz                        | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/moodle-4.0.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/moodle-4.0.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/msoms-0.2.0.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/msoms-0.2.0.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mssql-linux-0.6.2.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mssql-linux-0.6.2.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysql-0.10.2.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysql-0.10.2.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysqldump-1.0.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/mysqldump-1.0.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/namerd-0.2.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/namerd-0.2.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nats-1.3.1.tgz                                      | storage.objects.create |    25 |
    | projects/_/buckets/kubernetes-charts/objects/nats-1.3.1.tgz                                      | storage.objects.delete |    25 |
    | projects/_/buckets/kubernetes-charts/objects/nats-2.0.0.tgz                                      | storage.objects.delete |    23 |
    | projects/_/buckets/kubernetes-charts/objects/nats-2.0.0.tgz                                      | storage.objects.create |    23 |
    | projects/_/buckets/kubernetes-charts/objects/neo4j-0.8.0.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/neo4j-0.8.0.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/newrelic-infrastructure-0.7.0.tgz                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/newrelic-infrastructure-0.7.0.tgz                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-client-provisioner-1.2.0.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-client-provisioner-1.2.0.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-server-provisioner-0.2.1.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nfs-server-provisioner-0.2.1.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ingress-0.31.0.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ingress-0.31.0.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ldapauth-proxy-0.1.2.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-ldapauth-proxy-0.1.2.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-lego-0.3.1.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/nginx-lego-0.3.1.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-problem-detector-1.0.tgz                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-problem-detector-1.0.tgz                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-red-1.0.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/node-red-1.0.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/oauth2-proxy-0.6.0.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/oauth2-proxy-0.6.0.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-4.0.2.tgz                                      | storage.objects.delete |    19 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-4.0.2.tgz                                      | storage.objects.create |    19 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-5.0.0.tgz                                      | storage.objects.create |    29 |
    | projects/_/buckets/kubernetes-charts/objects/odoo-5.0.0.tgz                                      | storage.objects.delete |    29 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-3.2.0.tgz                                  | storage.objects.create |    19 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-3.2.0.tgz                                  | storage.objects.delete |    19 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-4.0.0.tgz                                  | storage.objects.delete |    29 |
    | projects/_/buckets/kubernetes-charts/objects/opencart-4.0.0.tgz                                  | storage.objects.create |    29 |
    | projects/_/buckets/kubernetes-charts/objects/openebs-0.7.2.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openebs-0.7.2.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openiban-1.0.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openiban-1.0.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openldap-0.2.4.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openldap-0.2.4.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openvpn-3.10.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/openvpn-3.10.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/orangehrm-4.0.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/orangehrm-4.0.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-3.2.0.tgz                                   | storage.objects.create |    18 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-3.2.0.tgz                                   | storage.objects.delete |    18 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-4.0.0.tgz                                   | storage.objects.create |    30 |
    | projects/_/buckets/kubernetes-charts/objects/osclass-4.0.0.tgz                                   | storage.objects.delete |    30 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-3.3.1.tgz                                  | storage.objects.create |    20 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-3.3.1.tgz                                  | storage.objects.delete |    20 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-4.0.0.tgz                                  | storage.objects.delete |    28 |
    | projects/_/buckets/kubernetes-charts/objects/owncloud-4.0.0.tgz                                  | storage.objects.create |    28 |
    | projects/_/buckets/kubernetes-charts/objects/pachyderm-0.1.8.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/pachyderm-0.1.8.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/parse-4.0.0.tgz                                     | storage.objects.delete |    17 |
    | projects/_/buckets/kubernetes-charts/objects/parse-4.0.0.tgz                                     | storage.objects.create |    17 |
    | projects/_/buckets/kubernetes-charts/objects/parse-5.0.0.tgz                                     | storage.objects.create |    31 |
    | projects/_/buckets/kubernetes-charts/objects/parse-5.0.0.tgz                                     | storage.objects.delete |    31 |
    | projects/_/buckets/kubernetes-charts/objects/percona-0.3.3.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/percona-0.3.3.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/percona-xtradb-cluster-0.6.0.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/percona-xtradb-cluster-0.6.0.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-3.3.4.tgz                               | storage.objects.delete |    20 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-3.3.4.tgz                               | storage.objects.create |    20 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-4.0.0.tgz                               | storage.objects.delete |    28 |
    | projects/_/buckets/kubernetes-charts/objects/phabricator-4.0.0.tgz                               | storage.objects.create |    28 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-3.2.1.tgz                                     | storage.objects.delete |    18 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-3.2.1.tgz                                     | storage.objects.create |    18 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-4.0.0.tgz                                     | storage.objects.delete |    30 |
    | projects/_/buckets/kubernetes-charts/objects/phpbb-4.0.0.tgz                                     | storage.objects.create |    30 |
    | projects/_/buckets/kubernetes-charts/objects/phpmyadmin-1.3.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/phpmyadmin-1.3.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.2.tgz                                | storage.objects.create |    19 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.2.tgz                                | storage.objects.delete |    19 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.3.tgz                                | storage.objects.create |    29 |
    | projects/_/buckets/kubernetes-charts/objects/postgresql-2.6.3.tgz                                | storage.objects.delete |    29 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-4.1.1.tgz                                | storage.objects.create |    23 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-4.1.1.tgz                                | storage.objects.delete |    23 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-5.0.0.tgz                                | storage.objects.delete |    25 |
    | projects/_/buckets/kubernetes-charts/objects/prestashop-5.0.0.tgz                                | storage.objects.create |    25 |
    | projects/_/buckets/kubernetes-charts/objects/presto-0.1.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/presto-0.1.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.0.0.tgz                                    | storage.objects.create |     2 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.0.0.tgz                                    | storage.objects.delete |     2 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.1.0.tgz                                    | storage.objects.create |    46 |
    | projects/_/buckets/kubernetes-charts/objects/prisma-1.1.0.tgz                                    | storage.objects.delete |    46 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-7.4.4.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-7.4.4.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-adapter-v0.2.0.tgz                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-adapter-v0.2.0.tgz                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-blackbox-exporter-0.2.0.tgz              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-blackbox-exporter-0.2.0.tgz              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-cloudwatch-exporter-0.2.1.tgz            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-cloudwatch-exporter-0.2.1.tgz            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-couchdb-exporter-0.1.0.tgz               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-couchdb-exporter-0.1.0.tgz               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-mysql-exporter-0.2.1.tgz                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-mysql-exporter-0.2.1.tgz                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-node-exporter-0.5.1.tgz                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-node-exporter-0.5.1.tgz                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-operator-0.1.25.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-operator-0.1.25.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-postgres-exporter-0.5.0.tgz              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-postgres-exporter-0.5.0.tgz              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-pushgateway-0.2.0.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-pushgateway-0.2.0.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-rabbitmq-exporter-0.1.4.tgz              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-rabbitmq-exporter-0.1.4.tgz              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-redis-exporter-0.3.4.tgz                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-redis-exporter-0.3.4.tgz                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-to-sd-0.1.1.tgz                          | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/prometheus-to-sd-0.1.1.tgz                          | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/quassel-0.2.9.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/quassel-0.2.9.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-3.6.3.tgz                                  | storage.objects.delete |    25 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-3.6.3.tgz                                  | storage.objects.create |    25 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-4.0.0.tgz                                  | storage.objects.create |    23 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-4.0.0.tgz                                  | storage.objects.delete |    23 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-ha-1.14.0.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rabbitmq-ha-1.14.0.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-4.2.10.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-4.2.10.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-ha-3.0.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redis-ha-3.0.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-6.0.2.tgz                                   | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-6.0.2.tgz                                   | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-7.0.0.tgz                                   | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/redmine-7.0.0.tgz                                   | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-notifchecker-1.0.6-ereneci.6a15d45.tgz   | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-notifchecker-1.0.6-ereneci.6a15d45.tgz   | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.1.tgz                        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.1.tgz                        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.0eea8ed.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.0eea8ed.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.428741b.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.428741b.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.5a1ca86.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.5a1ca86.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.b8fc945.tgz        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2-ereneci.b8fc945.tgz        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2.tgz                        | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/renegadedb-nudrsvc-3.0.2.tgz                        | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/rethinkdb-0.2.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rethinkdb-0.2.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/risk-advisor-2.0.4.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/risk-advisor-2.0.4.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rocketchat-0.1.5.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rocketchat-0.1.5.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rookout-0.1.0.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/rookout-0.1.0.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sapho-0.2.2.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sapho-0.2.2.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/schema-registry-ui-0.1.0.tgz                        | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/schema-registry-ui-0.1.0.tgz                        | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/searchlight-0.3.3.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/searchlight-0.3.3.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/selenium-0.12.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/selenium-0.12.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sematext-docker-agent-0.2.0.tgz                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sematext-docker-agent-0.2.0.tgz                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sensu-0.2.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sensu-0.2.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sentry-0.5.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sentry-0.5.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/seq-0.1.1.tgz                                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/seq-0.1.1.tgz                                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalfx-agent-0.3.0.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalfx-agent-0.3.0.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalsciences-0.0.1.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/signalsciences-0.0.1.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonarqube-0.10.1.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonarqube-0.10.1.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonatype-nexus-1.14.1.tgz                           | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sonatype-nexus-1.14.1.tgz                           | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-0.2.1.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-0.2.1.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-history-server-0.2.0.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spark-history-server-0.2.0.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spartakus-1.1.5.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spartakus-1.1.5.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spinnaker-1.1.6.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spinnaker-1.1.6.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spotify-docker-gc-0.3.0.tgz                         | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spotify-docker-gc-0.3.0.tgz                         | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spring-cloud-data-flow-1.0.0.tgz                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/spring-cloud-data-flow-1.0.0.tgz                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stackdriver-exporter-0.0.4.tgz                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stackdriver-exporter-0.0.4.tgz                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stash-0.5.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stash-0.5.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stellar-core-1.0.0.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stellar-core-1.0.0.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stolon-0.4.4.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/stolon-0.4.4.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-4.1.0.tgz                                  | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-4.1.0.tgz                                  | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-5.0.0.tgz                                  | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/suitecrm-5.0.0.tgz                                  | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/sumokube-0.1.4.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sumokube-0.1.4.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sumologic-fluentd-0.6.0.tgz                         | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sumologic-fluentd-0.6.0.tgz                         | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/superset-1.0.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/superset-1.0.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/swift-0.6.3.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/swift-0.6.3.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sysdig-1.2.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/sysdig-1.2.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/telegraf-0.3.3.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/telegraf-0.3.3.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-notebook-0.1.2.tgz                       | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-notebook-0.1.2.tgz                       | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-serving-0.1.2.tgz                        | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tensorflow-serving-0.1.2.tgz                        | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/terracotta-1.0.0.tgz                                | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/terracotta-1.0.0.tgz                                | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-3.2.0.tgz                                  | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-3.2.0.tgz                                  | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-4.0.0.tgz                                  | storage.objects.delete |    24 |
    | projects/_/buckets/kubernetes-charts/objects/testlink-4.0.0.tgz                                  | storage.objects.create |    24 |
    | projects/_/buckets/kubernetes-charts/objects/tomcat-0.1.0.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/tomcat-0.1.0.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/traefik-1.53.0.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/traefik-1.53.0.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/uchiwa-0.2.7.tgz                                    | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/uchiwa-0.2.7.tgz                                    | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/ui/static-nginx-asset-mi/mi-assets-6.26.0-2-NY5.tgz | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/ui/static-nginx-asset-mi/mi-assets-6.26.0-2-NY5.tgz | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/unbound-0.1.2.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/unbound-0.1.2.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/unifi-0.2.1.tgz                                     | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/unifi-0.2.1.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/vault-operator-0.1.1.tgz                            | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/vault-operator-0.1.1.tgz                            | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/verdaccio-0.5.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/verdaccio-0.5.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/voyager-3.2.4.tgz                                   | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/voyager-3.2.4.tgz                                   | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-cloud-0.3.0.tgz                               | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-cloud-0.3.0.tgz                               | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-scope-0.10.0.tgz                              | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/weave-scope-0.10.0.tgz                              | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/wordpress-4.0.0.tgz                                 | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/wordpress-4.0.0.tgz                                 | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1029.136.tgz                          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1029.136.tgz                          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1047.137.tgz                          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1047.137.tgz                          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1124.138.tgz                          | storage.objects.get    |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xero-20181121.1124.138.tgz                          | storage.objects.list   |     1 |
    | projects/_/buckets/kubernetes-charts/objects/xray-0.4.2.tgz                                      | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/xray-0.4.2.tgz                                      | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zeppelin-1.0.1.tgz                                  | storage.objects.create |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zeppelin-1.0.1.tgz                                  | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zetcd-0.1.9.tgz                                     | storage.objects.delete |    48 |
    | projects/_/buckets/kubernetes-charts/objects/zetcd-0.1.9.tgz                                     | storage.objects.create |    48 |
    +--------------------------------------------------------------------------------------------------|------------------------|-------+

### Locate Bucket information<a id="sec-1-1-3"></a>

```shell
gsutil logging get gs://kubernetes-charts | jq .
```

```json

```

### Query: Which user agent is making the most requests?<a id="sec-1-1-4"></a>

```shell
SELECT DISTINCT protopayload_auditlog.requestMetadata.callerSuppliedUserAgent AS callerSuppliedUserAgent, COUNT(protopayload_auditlog.requestMetadata.callerSuppliedUserAgent) AS count
FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
GROUP BY protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
ORDER BY count DESC, callerSuppliedUserAgent
```

    
    +---------------------------------------------------------------------------------------------------------------------------------------------------------|--------+
    |                                                                 callerSuppliedUserAgent                                                                 | count  |
    +---------------------------------------------------------------------------------------------------------------------------------------------------------|--------+
    | git/2.17.1,gzip(gfe)                                                                                                                                    | 895706 |
    | git/2.17.0,gzip(gfe)                                                                                                                                    |  20193 |
    | apitools gsutil/4.34 Python/2.7.13 (linux2) google-cloud-sdk/225.0.0 analytics/disabled,gzip(gfe)                                                       |   7987 |
    | apitools gsutil/4.34 Python/2.7.13 (linux2) google-cloud-sdk/226.0.0 analytics/disabled,gzip(gfe)                                                       |   3630 |
    | Artifactory/4.16.0,gzip(gfe)                                                                                                                            |   1554 |
    | Artifactory/6.5.2,gzip(gfe)                                                                                                                             |    279 |
    | git/2.7.4,gzip(gfe)                                                                                                                                     |    168 |
    | Helm/2.9.1,gzip(gfe)                                                                                                                                    |     95 |
    | Artifactory/6.4.1,gzip(gfe)                                                                                                                             |     94 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                           |     42 |
    | Artifactory/6.3.3,gzip(gfe)                                                                                                                             |     34 |
    | Artifactory/6.1.0,gzip(gfe)                                                                                                                             |     32 |
    | Artifactory/6.5.1,gzip(gfe)                                                                                                                             |     28 |
    | Artifactory/5.8.0,gzip(gfe)                                                                                                                             |     24 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |     22 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |     21 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                      |     20 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                            |     18 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15,gzip(gfe)                       |     18 |
    | Artifactory/6.2.0,gzip(gfe)                                                                                                                             |     14 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                            |     14 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                      |     14 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.1 Safari/605.1.15,gzip(gfe)                       |     14 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                |     13 |
    | Helm/2.11.0,gzip(gfe)                                                                                                                                   |     12 |
    | Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                  |     12 |
    | Mozilla/5.0 (X11; FreeBSD amd64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                         |     10 |
    | Slackbot 1.0 (+https://api.slack.com/robots),gzip(gfe)                                                                                                  |     10 |
    | Artifactory/6.5.0,gzip(gfe)                                                                                                                             |      8 |
    | Artifactory/6.5.3,gzip(gfe)                                                                                                                             |      8 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/70.0.3538.77 Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)         |      8 |
    | Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm),gzip(gfe)                                                                       |      8 |
    | Artifactory/5.10.4,gzip(gfe)                                                                                                                            |      7 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                                      |      7 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |      6 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36,gzip(gfe)                            |      6 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                                     |      6 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36,gzip(gfe)                                     |      6 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36,gzip(gfe)                           |      5 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36,gzip(gfe)                                     |      5 |
    | Artifactory/5.9.0,gzip(gfe)                                                                                                                             |      4 |
    | Artifactory/5.9.3,gzip(gfe)                                                                                                                             |      4 |
    | Mozilla/5.0 (Windows NT 10.0; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0,gzip(gfe)                                                                     |      4 |
    | Mozilla/5.0 (Windows NT 10.0; WOW64; rv:60.0) Gecko/20100101 Firefox/60.0,gzip(gfe)                                                                     |      4 |
    | Mozilla/5.0 (Windows NT 6.1; Trident/7.0; rv:11.0) like Gecko,gzip(gfe)                                                                                 |      4 |
    | Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                                 |      4 |
    | Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0,gzip(gfe)                                                                      |      4 |
    | Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.75 Safari/537.36,gzip(gfe)                             |      4 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.75 Safari/537.36 Google Favicon,gzip(gfe)                       |      4 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.67 Safari/537.36,gzip(gfe)                                      |      4 |
    | Mozilla/5.0 (X11; Linux x86_64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                          |      4 |
    | Googlebot-Image/1.0,gzip(gfe)                                                                                                                           |      3 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:60.0) Gecko/20100101 Firefox/60.0,gzip(gfe)                                                            |      3 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |      3 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Safari/605.1.15,gzip(gfe)                           |      3 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                            |      3 |
    | Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                             |      3 |
    | Artifactory/5.10.0,gzip(gfe)                                                                                                                            |      2 |
    | Artifactory/5.10.3,gzip(gfe)                                                                                                                            |      2 |
    | Artifactory/5.11.0,gzip(gfe)                                                                                                                            |      2 |
    | Artifactory/5.9.1,gzip(gfe)                                                                                                                             |      2 |
    | Artifactory/6.0.1,gzip(gfe)                                                                                                                             |      2 |
    | Artifactory/6.3.2,gzip(gfe)                                                                                                                             |      2 |
    | CCBot/2.0 (https://commoncrawl.org/faq/),gzip(gfe)                                                                                                      |      2 |
    | Go-http-client/2.0,gzip(gfe)                                                                                                                            |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:64.0) Gecko/20100101 Firefox/64.0,gzip(gfe)                                                            |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36,gzip(gfe)                     |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36,gzip(gfe)                      |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36,gzip(gfe)                     |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36,gzip(gfe)                      |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36,gzip(gfe)                      |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3602.2 Safari/537.36,gzip(gfe)                       |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3615.0 Safari/537.36,gzip(gfe)                       |      2 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0.2 Safari/605.1.15,gzip(gfe)                       |      2 |
    | Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.101 Safari/537.36,gzip(gfe)                                |      2 |
    | Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                                |      2 |
    | Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3616.0 Safari/537.36,gzip(gfe)                                  |      2 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36,gzip(gfe)                           |      2 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3534.4 Safari/537.36,gzip(gfe)                             |      2 |
    | Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36,gzip(gfe)                                        |      2 |
    | Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                                        |      2 |
    | Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36; 360Spider,gzip(gfe)                      |      2 |
    | Mozilla/5.0 (Windows NT 6.1; WOW64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                      |      2 |
    | Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.106 Safari/537.36,gzip(gfe)                            |      2 |
    | Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                            |      2 |
    | Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0,gzip(gfe)                                                                 |      2 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.139 Safari/537.36,gzip(gfe)                                     |      2 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.87 Safari/537.36,gzip(gfe)                                      |      2 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3440.84 Safari/537.36,gzip(gfe)                                      |      2 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.103 Safari/537.36 Viv/2.1.1337.47,gzip(gfe)                     |      2 |
    | Mozilla/5.0 (compatible; BLEXBot/1.0; +http://webmeup-crawler.com/),gzip(gfe)                                                                           |      2 |
    | Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html),gzip(gfe)                                                                      |      2 |
    | Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots),gzip(gfe)                                                                              |      2 |
    | Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) CriOS/70.0.3538.75 Mobile/15E148 Safari/604.1,gzip(gfe) |      2 |
    | Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/70.0.3538.75 Mobile/15E148 Safari/605.1,gzip(gfe) |      2 |
    | Nexus/3.13.0-01 (OSS; Linux; 3.10.0-862.11.6.el7.x86_64; amd64; 1.8.0_181),gzip(gfe)                                                                    |      2 |
    | Nexus/3.13.0-01 (PRO; Windows Server 2012; 6.2; amd64; 1.8.0_172),gzip(gfe)                                                                             |      2 |
    | git/2.5.4 (Apple Git-61),gzip(gfe)                                                                                                                      |      2 |
    | ltx71 - (http://ltx71.com/),gzip(gfe)                                                                                                                   |      2 |
    | Artifactory/6.3.0,gzip(gfe)                                                                                                                             |      1 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.1 Safari/603.1.30,gzip(gfe)                         |      1 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36,gzip(gfe)                     |      1 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36,gzip(gfe)                     |      1 |
    | Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36,gzip(gfe)                      |      1 |
    | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.170 Safari/537.36,gzip(gfe)                           |      1 |
    | Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko,gzip(gfe)                                                                          |      1 |
    | Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.81 Safari/537.36,gzip(gfe)                                      |      1 |
    | Twingly Recon-Klondike/1.0 (+https://developer.twingly.com),gzip(gfe)                                                                                   |      1 |
    +---------------------------------------------------------------------------------------------------------------------------------------------------------|--------+

## References<a id="sec-1-2"></a>

-   [BigQuery - kubernetes-charts - Google Cloud Platform](https://console.cloud.google.com/bigquery?project=kubernetes-charts&p=kubernetes-charts&d=kubernetes_charts_data_access&page=dataset&pli=1)
-   [The Firebase Blog: BigQuery Tip: The UNNEST Function](https://firebase.googleblog.com/2017/03/bigquery-tip-unnest-function.html)

## Schema<a id="sec-1-3"></a>

Details about the Big Query table schema as listed within the web console editor.

| **Field name** | **Type**  | **Mode** | **Description**                                               |
| logName        | STRING    | NULLABLE | The resource name of the log to which this log entry belongs. |
| timestamp      | TIMESTAMP | NULLABLE | The time the event described by the log entry occurred.       |
| severity       | STRING    | NULLABLE | The severity of the log entry.                                |
| insertId       | STRING    | NULLABLE | A unique ID for the log entry.                                |
| trace          | STRING    | NULLABLE | Resource name of the trace associated with the log entry.     |

| **Field name**                           | **Type** | **Mode** | **Description**                                        |
| resource                                 | RECORD   | NULLABLE | The monitored resource associated with this log entry. |
| resource. type                           | STRING   | NULLABLE | The type of monitored resource.                        |
| resource. labels                         | RECORD   | NULLABLE |                                                        |
| resource.labels. bucket<sub>name</sub>   | STRING   | NULLABLE |                                                        |
| resource.labels. project<sub>id</sub>    | STRING   | NULLABLE |                                                        |
| resource.labels. location                | STRING   | NULLABLE |                                                        |
| resource.labels. storage<sub>class</sub> | STRING   | NULLABLE |                                                        |

**Note:** The `httpRequest` doesn't seem to be recording any data yet. Only results so far are `null`.

| **Field name**                              | **Type** | **Mode** | **Description**                                                                                                                                     |
| httpRequest                                 | RECORD   | NULLABLE | Information about the HTTP request associated with this log entry, if applicable.                                                                   |
| httpRequest. requestMethod                  | STRING   | NULLABLE | The request http method.                                                                                                                            |
| httpRequest. requestUrl                     | STRING   | NULLABLE | The scheme (http, https), the host name, the path and the query portion of the URL that was requested.                                              |
| httpRequest. requestSize                    | INTEGER  | NULLABLE | The size of the HTTP request message in bytes, including the request headers and the request body.                                                  |
| httpRequest. status                         | INTEGER  | NULLABLE | The response code indicating the status of response.                                                                                                |
| httpRequest. responseSize                   | INTEGER  | NULLABLE | The size of the HTTP response message sent back to the client, in bytes, including the response headers and the response body.                      |
| httpRequest. userAgent                      | STRING   | NULLABLE | The user agent sent by the client.                                                                                                                  |
| httpRequest. remoteIp                       | STRING   | NULLABLE | The IP address (IPv4 or IPv6) of the client that issued the HTTP request.                                                                           |
| httpRequest. serverIp                       | STRING   | NULLABLE | The IP address (IPv4 or IPv6) of the origin server that the request was sent to.                                                                    |
| httpRequest. referer                        | STRING   | NULLABLE | The referrer URL of the request, as defined in HTTP/1.1 Header Field Definitions.                                                                   |
| httpRequest. cacheLookup                    | BOOLEAN  | NULLABLE | Whether or not a cache lookup was attempted.                                                                                                        |
| httpRequest. cacheHit                       | BOOLEAN  | NULLABLE | Whether or not an entity was served from cache (with or without validation).                                                                        |
| httpRequest. cacheValidatedWithOriginServer | BOOLEAN  | NULLABLE | Whether or not the response was validated with the origin server before being served from cache. This field is only meaningful if cacheHit is True. |
| httpRequest. cacheFillBytes                 | INTEGER  | NULLABLE | The number of HTTP response bytes inserted into cache. Set only when a cache fill was attempted.                                                    |
| httpRequest. protocol                       | STRING   | NULLABLE |                                                                                                                                                     |

**Note:** `sourceLocation` doesn't seem to be recording any data yet. Only results so far are `null`.

| **Field name**           | **Type** | **Mode** | **Description**                                                                                                       |
| operation                | RECORD   | NULLABLE | Information about an operation associated with the log entry, if applicable.                                          |
| operation. id            | STRING   | NULLABLE | An arbitrary operation identifier. Log entries with the same identifier are assumed to be part of the same operation. |
| operation. producer      | STRING   | NULLABLE | An arbitrary producer identifier. The combination of id and producer should be globally unique.                       |
| operation. first         | BOOLEAN  | NULLABLE | Set to True if this is the first log entry in the operation.                                                          |
| operation. last          | BOOLEAN  | NULLABLE | Set to True if this is the last log entry in the operation.                                                           |
| sourceLocation           | RECORD   | NULLABLE | Source code location information associated with the log entry.                                                       |
| sourceLocation. file     | STRING   | NULLABLE | Source file name. Depending on the runtime environment, this might be a simple name or a fully-qualified name.        |
| sourceLocation. line     | INTEGER  | NULLABLE | Line within the source file. 1-based; 0 indicates no line number available.                                           |
| sourceLocation. function | STRING   | NULLABLE | Human-readable name of the function or method being invoked, with optional context such as the class or package name. |

| **Field name**                                                        | **Type** | **Mode** | **Description**                                                                                                                    |
| protopayload<sub>auditlog</sub>                                       | RECORD   | NULLABLE | Common audit log format for Google Cloud Platform API operations.                                                                  |
| protopayload<sub>auditlog</sub>. serviceName                          | STRING   | NULLABLE | The name of the API service performing the operation.                                                                              |
| protopayload<sub>auditlog</sub>. methodName                           | STRING   | NULLABLE | The name of the service method or operation. For API calls, this should be the name of the API method.                             |
| protopayload<sub>auditlog</sub>. resourceName                         | STRING   | NULLABLE | The resource or collection that is the target of the operation. The name is a scheme-less URI, not including the API service name. |
| protopayload<sub>auditlog</sub>. numResponseItems                     | INTEGER  | NULLABLE | The number of items returned from a List or Query API method, if applicable.                                                       |
| protopayload<sub>auditlog</sub>. status                               | RECORD   | NULLABLE | The status of the overall operation.                                                                                               |
| protopayload<sub>auditlog.status</sub>. code                          | INTEGER  | NULLABLE | The status code.                                                                                                                   |
| protopayload<sub>auditlog.status</sub>. message                       | STRING   | NULLABLE | A developer-facing error message, which should be in English.                                                                      |
| protopayload<sub>auditlog</sub>. authenticationInfo                   | RECORD   | NULLABLE | Authentication information.                                                                                                        |
| protopayload<sub>auditlog.authenticationInfo</sub>. principalEmail    | STRING   | NULLABLE | The email address of the authenticated user making the request.                                                                    |
| protopayload<sub>auditlog.authenticationInfo</sub>. authoritySelector | STRING   | NULLABLE |                                                                                                                                    |

| **Field name**                                                                     | **Type** | **Mode** | **Description**                                                                                                                                    |
| protopayload<sub>auditlog</sub>. authorizationInfo                                 | RECORD   | REPEATED | Authorization information. If there are multiple resources or permissions involved, then there is one AuthorizationIn {resource, permission} tuple |
| protopayload<sub>auditlog.authorizationInfo</sub>. resource                        | STRING   | NULLABLE | The resource being accessed, as a REST-style string.                                                                                               |
| protopayload<sub>auditlog.authorizationInfo</sub>. permission                      | STRING   | NULLABLE | The required IAM permission.                                                                                                                       |
| protopayload<sub>auditlog.authorizationInfo</sub>. granted                         | BOOLEAN  | NULLABLE | Whether or not authorization for resource and permission was granted.                                                                              |
| protopayload<sub>auditlog.authorizationInfo</sub>. resourceAttributes              | RECORD   | NULLABLE |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes</sub>. service      | STRING   | NULLABLE |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes</sub>. name         | STRING   | NULLABLE |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes</sub>. type         | STRING   | NULLABLE |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes</sub>. labels       | RECORD   | REPEATED |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes.labels</sub>. key   | STRING   | NULLABLE |                                                                                                                                                    |
| protopayload<sub>auditlog.authorizationInfo.resourceAttributes.labels</sub>. value | STRING   | NULLABLE |                                                                                                                                                    |

| **Field name**                                                                       | **Type**  | **Mode** | **Description**                                                                                        |
| protopayload<sub>auditlog</sub>. requestMetadata                                     | RECORD    | NULLABLE | Metadata about the operation.                                                                          |
| protopayload<sub>auditlog.requestMetadata</sub>. callerIp                            | STRING    | NULLABLE | The IP address of the caller.                                                                          |
| protopayload<sub>auditlog.requestMetadata</sub>. callerSuppliedUserAgent             | STRING    | NULLABLE | The user agent of the caller. This information is not authenticated and should be treated accordingly. |
| protopayload<sub>auditlog.requestMetadata</sub>. callerNetwork                       | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata</sub>. requestAttributes                   | RECORD    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. id                | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. method            | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. headers           | RECORD    | REPEATED |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.headers</sub>. key       | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.headers</sub>. value     | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. path              | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. host              | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. scheme            | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. query             | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. fragment          | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. time              | TIMESTAMP | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. size              | INTEGER   | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. protocol          | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. reason            | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes</sub>. auth              | RECORD    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.auth</sub>. principal    | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.auth</sub>. audiences    | STRING    | REPEATED |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.auth</sub>. presenter    | STRING    | NULLABLE |                                                                                                        |
| protopayload<sub>auditlog.requestMetadata.requestAttributes.auth</sub>. accessLevels | STRING    | REPEATED |                                                                                                        |

| **Field name**                                                                      | **Type** | **Mode** | **Description** |
| protopayload<sub>auditlog.requestMetadata</sub>. destinationAttributes              | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. ip           | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. port         | INTEGER  | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. service      | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. labels       | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes.labels</sub>. key   | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes.labels</sub>. value | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. principal    | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.requestMetadata.destinationAttributes</sub>. regionCode   | STRING   | NULLABLE |                 |

| **Field name**                                                                                                      | **Type** | **Mode** | **Description** |
| protopayload<sub>auditlog</sub>. servicedata<sub>v1</sub><sub>iam</sub>                                             | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam</sub>. policyUpdate                                | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate</sub>. version                        | INTEGER  | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate</sub>. bindings                       | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings</sub>. role                  | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings</sub>. members               | STRING   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings</sub>. condition             | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings.condition</sub>. expression  | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings.condition</sub>. title       | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings.condition</sub>. description | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.bindings.condition</sub>. location    | STRING   | NULLABLE |                 |

| **Field name**                                                                                                                    | **Type** | **Mode** | **Description** |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate</sub>. auditConfigs                                 | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.auditConfigs</sub>. service                         | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.auditConfigs</sub>. exemptedMembers                 | STRING   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.auditConfigs</sub>. auditLogConfigs                 | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.auditConfigs.auditLogConfigs</sub>. logType         | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate.auditConfigs.auditLogConfigs</sub>. exemptedMembers | STRING   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate</sub>. etag                                         | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyUpdate</sub>. iamOwned                                     | BOOLEAN  | NULLABLE |                 |

| **Field name**                                                                                                          | **Type** | **Mode** | **Description** |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam</sub>. policyDelta                                     | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta</sub>. bindingDeltas                       | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas</sub>. action                | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas</sub>. role                  | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas</sub>. member                | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas</sub>. condition             | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas.condition</sub>. expression  | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas.condition</sub>. title       | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas.condition</sub>. description | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.bindingDeltas.condition</sub>. location    | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta</sub>. auditConfigDeltas                   | RECORD   | REPEATED |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.auditConfigDeltas</sub>. action            | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.auditConfigDeltas</sub>. service           | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.auditConfigDeltas</sub>. exemptedMember    | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog.servicedata</sub><sub>v1</sub><sub>iam.policyDelta.auditConfigDeltas</sub>. logType           | STRING   | NULLABLE |                 |
| protopayload<sub>auditlog</sub>. resourceLocation                                                                       | RECORD   | NULLABLE |                 |
| protopayload<sub>auditlog.resourceLocation</sub>. currentLocations                                                      | STRING   | REPEATED |                 |
| protopayload<sub>auditlog.resourceLocation</sub>. originalLocations                                                     | STRING   | REPEATED |                 |

| **Field name**   | **Type**  | **Mode** | **Description** |
| receiveTimestamp | TIMESTAMP | NULLABLE |                 |
| spanId           | STRING    | NULLABLE |                 |
| textPayload      | STRING    | NULLABLE |                 |
| traceSampled     | BOOLEAN   | NULLABLE |                 |

## Testing various ideas/queries with console.cloud.google.com/bigquery<a id="sec-1-4"></a>

Testing ideas with the web console. To be cleaned up

-   [BigQuery - kubernetes-charts - Google Cloud Platform](https://console.cloud.google.com/bigquery?project=kubernetes-charts&p=kubernetes-charts&d=kubernetes_charts_data_access&page=dataset&pli=1)

    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE protopayload_auditlog.resourceName LIKE '%gitlab-ee-0.2.2.tgz'
          AND ( authorizationInfo.permission = 'storage.objects.create'
          OR authorizationInfo.permission = 'storage.objects.delete' )
    ORDER BY timestamp
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE protopayload_auditlog.resourceName LIKE '%gitlab-ee-0.2.2.tgz'
          AND ( authorizationInfo.permission = 'storage.objects.create'
          OR authorizationInfo.permission = 'storage.objects.delete' )
    ORDER BY timestamp
    
    ===================================
    
    SELECT DISTINCT authorizationInfo.resource AS resource, COUNT(authorizationInfo.resource) AS count
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.create'
    GROUP BY authorizationInfo.resource
    ORDER BY count DESC, authorizationInfo.resource
    
    ===================================
    
    SELECT DISTINCT authorizationInfo.resource AS resource, COUNT(authorizationInfo.resource) AS count
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.create'
          OR authorizationInfo.permission = 'storage.objects.delete'
    GROUP BY authorizationInfo.resource
    ORDER BY count DESC, authorizationInfo.resource
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.create'
          OR authorizationInfo.permission = 'storage.objects.delete'
    ORDER BY timestamp
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE protopayload_auditlog.requestMetadata.callerSuppliedUserAgent LIKE 'Helm%'
    ORDER BY timestamp
    
    ===================================
    
    SELECT DISTINCT protopayload_auditlog.requestMetadata.callerSuppliedUserAgent AS callerSuppliedUserAgent, COUNT(protopayload_auditlog.requestMetadata.callerSuppliedUserAgent) AS count
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    GROUP BY protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    ORDER BY count DESC, callerSuppliedUserAgent
    
    ===================================
    
    SELECT DISTINCT protopayload_auditlog.requestMetadata.callerSuppliedUserAgent AS callerSuppliedUserAgent, COUNT(protopayload_auditlog.requestMetadata.callerSuppliedUserAgent) AS count
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    GROUP BY protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    ORDER BY count
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.list'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.delete'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo.permission = 'storage.objects.get'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE authorizationInfo IS NOT NULL
        AND authorizationInfo.permission = 'storage.objects.get'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    -- bindingDeltas.action,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo -- ,
         -- UNNEST(protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas) AS bindingDeltas
    WHERE authorizationInfo IS NOT NULL
        -- AND bindingDeltas.action = 'ADD'
        AND authorizationInfo.permission = 'storage.objects.list'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    bindingDeltas.action,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo,
         UNNEST(protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas) AS bindingDeltas
    WHERE  authorizationInfo IS NOT NULL
        AND bindingDeltas.action = 'ADD'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    bindingDeltas.action,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo,
         UNNEST(protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas) AS bindingDeltas
    WHERE  ( authorizationInfo IS NOT NULL
        OR bindingDeltas IS NOT NULL )AND bindingDeltas.action != 'ADD'
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    bindingDeltas.action,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo,
         UNNEST(protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas) AS bindingDeltas
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
        AND ( authorizationInfo IS NOT NULL
        OR bindingDeltas IS NOT NULL )
    ORDER BY timestamp
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    bindingDeltas.action,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo,
         UNNEST(protopayload_auditlog.servicedata_v1_iam.policyDelta. bindingDeltas) AS bindingDeltas
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
        AND ( authorizationInfo IS NOT NULL
        OR bindingDeltas IS NOT NULL )
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.methodName,
    authorizationInfo.resource,
    authorizationInfo.permission,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
        AND authorizationInfo IS NOT NULL
    ORDER BY timestamp
    LIMIT 50
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.methodName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121,
         UNNEST(protopayload_auditlog.authorizationInfo) AS authorizationInfo
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
        AND authorizationInfo IS NOT NULL
    ORDER BY timestamp
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.methodName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.methodName,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp
    LIMIT 5
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    protopayload_auditlog.methodName,
    protopayload_auditlog.authorizationInfo,
    protopayload_auditlog.requestMetadata.callerIp,
    protopayload_auditlog.requestMetadata.callerSuppliedUserAgent,
    protopayload_auditlog.servicedata_v1_iam.policyDelta.bindingDeltas
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp
    LIMIT 5
    
    ===================================
    
    SELECT timestamp, receiveTimestamp,
    protopayload_auditlog.resourceName,
    protopayload_auditlog
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp
    LIMIT 5
    
    ===================================
    
    SELECT timestamp, receiveTimestamp,
    protopayload_auditlog.resourceName,
    httpRequest
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE httpRequest IS NOT NULL
    ORDER BY timestamp
    LIMIT 250
    
    ===================================
    
    SELECT timestamp, receiveTimestamp,
    protopayload_auditlog.resourceName,
    logName
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE severity = 'ERROR'
    ORDER BY timestamp
    LIMIT 250
    
    ===================================
    
    SELECT timestamp, receiveTimestamp,
    protopayload_auditlog.resourceName,
    spanId,
    textPayload,
    traceSampled
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE sourceLocation IS NOT NULL
    ORDER BY timestamp
    LIMIT 250
    
    ===================================
    
    SELECT timestamp, receiveTimestamp,
    protopayload_auditlog.resourceName,
    spanId,
    textPayload,
    traceSampled
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE spanId IS NOT NULL OR textPayload IS NOT NULL OR traceSampled IS NOT NULL
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    ====================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    receiveTimestamp,
    spanId,
    textPayload,
    traceSampled
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    sourceLocation,
    protopayload_auditlog
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    ===================================
    
    SELECT timestamp, protopayload_auditlog.resourceName,
    httpRequest.requestMethod,
    httpRequest.requestUrl,
    httpRequest.requestSize,
    httpRequest.status,
    httpRequest.responseSize,
    httpRequest.userAgent,
    httpRequest.remoteIp,
    httpRequest.serverIp,
    httpRequest.referer,
    httpRequest.cacheLookup,
    httpRequest.cacheHit
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName LIKE '%.tgz'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    ==============================
    
    SELECT timestamp, protopayload_auditlog.resourceName
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName != 'projects/_/buckets/kubernetes-charts/objects/info/refs'
    		AND protopayload_auditlog.resourceName NOT LIKE '%.tgz'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    ===============================
    
    SELECT timestamp,
    protopayload_auditlog.resourceName,
    trace,
    resource.type,
    resource.labels.bucket_name,
    resource.labels.project_id ,
    resource.labels.location,
    resource.labels.storage_class
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName != 'projects/_/buckets/kubernetes-charts/objects/info/refs'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250
    
    =============================================================
    
    SELECT timestamp,
    protopayload_auditlog.resourceName,
    logName,
    severity,
    insertId
    FROM kubernetes_charts_data_access.cloudaudit_googleapis_com_data_access_20181121
    WHERE protopayload_auditlog.resourceName != 'projects/_/buckets/kubernetes-charts/objects/info/refs' OR severity != 'INFO'
    ORDER BY timestamp, protopayload_auditlog.resourceName
    LIMIT 250

## Data Insights<a id="sec-1-5"></a>

-   logName: projects/kubernetes-charts/logs/cloudaudit.googleapis.com%2Fdata<sub>access</sub>
-   severity: INFO, ERROR
-   trace: null

-   resource.type: gcs<sub>bucket</sub>
-   resource.labels.bucket<sub>name</sub>: kubernetes-charts
-   resource.labels.project<sub>id</sub>: kubernetes-charts
-   resource.labels.location: us
-   resource.labels.storage<sub>class</sub>: null

-   sourceLocation.file: null
-   sourceLocation.line: null
-   sourceLocation.function: null

-   httpRequest: null

-   spanId: null
-   textPayload: null
-   traceSampled: null

-   protopayload<sub>auditlog.serviceName</sub>: storage.googleapis.com
-   protopayload<sub>auditlog.methodName</sub>: storage.objects.get, storage.objects.create

-   protopayload<sub>auditlog</sub>.
    -   authenticationInfo.
    -   authorizationInfo.
        -   requestMetadata": { "callerIp": "18.232.141.40", "callerSuppliedUserAgent": "apitools gsutil/4.34 Python/2.7.13 (linux2) google-cloud-sdk/225.0.0 analytics/disabled,gzip(gfe)"

-   protopayload<sub>auditlog.authorizationInfo.resource</sub>
-   projects/\_/buckets/kubernetes-charts storage.objects.list, storage.objects.get
-   projects/\_/buckets/kubernetes-charts/objects/ark-1.2.2.tgz storage.objects.create, storage.objects.delete

-   protopayload<sub>auditlog.authorizationInfo.permission</sub>
    -   storage.objects.list
    -   storage.objects.get
    -   storage.objects.create
    -   storage.objects.delete

-   protopayload<sub>auditlog.methodName</sub>
    -   storage.objects.get
    -   storage.objects.create

\#+NAME Where are some of the clients hitting k8s-charts

    dig -x 18.232.141.40 +short
    ec2-18-232-141-40.compute-1.amazonaws.com.
    
    dig +short -x 52.65.18.81
    ec2-52-65-18-81.ap-southeast-2.compute.amazonaws.com.
    
    dig +short -x 34.207.110.137
    ec2-34-207-110-137.compute-1.amazonaws.com.

## Insights: ResourceNames<a id="sec-1-6"></a>

    projects/_/buckets/kubernetes-charts/objects/org/glassfish/web/javax.el/3.0.0/javax.el-3.0.0.pom
    projects/_/buckets/kubernetes-charts/objects/org/glassfish/web/javax.el/3.0.0/javax.el-3.0.0.jar
    
    projects/_/buckets/kubernetes-charts/objects/1kXelGKJTs4CfZY3
    
    projects/_/buckets/kubernetes-charts/objects/yygsqZQBewwSs0Re
    
    projects/_/buckets/kubernetes-charts/objects/gitlab-ee-0.2.2.tgz
    
    projects/_/buckets/kubernetes-charts/objects/ %.tgz
    
    projects/_/buckets/kubernetes-charts/objects/info/refs
    projects/_/buckets/kubernetes-charts/objects/favicon.ico
    
    projects/_/buckets/kubernetes-charts/objects/postgresql
    
    projects/_/buckets/kubernetes-charts/objects/charts
    projects/_/buckets/kubernetes-charts/objects/index.yaml
    projects/_/buckets/kubernetes-charts/objects/index.yaml:properties      <<< Interesting