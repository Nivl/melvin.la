FROM golang:1.24-alpine

RUN apk update && apk upgrade
RUN apk add curl git gcc musl-dev postgresql-client
# github.com/actions/cache requires a version of tar that supports --posix
# The one installed by default doesn't support it
RUN apk add --no-cache tar

ARG MIGRATE_VERSION=4.18.3
ARG MIGRATE_SHASUM="60c59c0cac50e99172d95135b2f421863c4b2f4a67709e66daae024d652fa1b5  migrate.linux-amd64.tar.gz"
RUN curl -L -o migrate.linux-amd64.tar.gz https://github.com/golang-migrate/migrate/releases/download/v${MIGRATE_VERSION}/migrate.linux-amd64.tar.gz && \
    tar xvzf migrate.linux-amd64.tar.gz && \
    echo "$MIGRATE_SHASUM" | sha256sum -c - && \
    mv migrate /usr/local/bin/migrate


ARG TASK_VERSION=3.43.2
ARG TASK_SHASUM="084e493dba4892572f235bf418ce8cfaed698b1f6f828da42c51c209930635db  task_linux_amd64.tar.gz"
RUN curl -L -o task_linux_amd64.tar.gz https://github.com/go-task/task/releases/download/v${TASK_VERSION}/task_linux_amd64.tar.gz && \
    tar xvzf task_linux_amd64.tar.gz && \
    echo "$TASK_SHASUM" | sha256sum -c - && \
    mv task /usr/local/bin/task


ARG GOLANG_CI_VERSION=2.1.5
ARG GOLANG_CI_SHASUM="8c71aea61ce6ef83f32c23a0067ba5b6b7064043767bcb99ddfdd6678e3c7644  golangci-lint.tar.gz"
RUN curl -L -o golangci-lint.tar.gz https://github.com/golangci/golangci-lint/releases/download/v${GOLANG_CI_VERSION}/golangci-lint-${GOLANG_CI_VERSION}-linux-amd64.tar.gz && \
    tar xvzf golangci-lint.tar.gz --strip-components=1 && \
    echo "$GOLANG_CI_SHASUM" | sha256sum -c - && \
    mv golangci-lint /usr/local/bin/golangci-lint


ARG GOTESTSUM_VERSION=1.12.1
ARG GOTESTSUM_SHASUM="488e645b87169935095980d89c133c9d9b246196ac25c70099614694c0fb6d39  gotestsum.tar.gz"
RUN curl -L -o gotestsum.tar.gz https://github.com/gotestyourself/gotestsum/releases/download/v${GOTESTSUM_VERSION}/gotestsum_${GOTESTSUM_VERSION}_linux_amd64.tar.gz && \
    tar xvzf gotestsum.tar.gz && \
    echo "$GOTESTSUM_SHASUM" | sha256sum -c - && \
    mv gotestsum /usr/local/bin/gotestsum
