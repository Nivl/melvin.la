FROM golang:1.23-alpine

RUN apk update && apk upgrade
RUN apk add curl git gcc musl-dev postgresql-client
# github.com/actions/cache requires a version of tar that supports --posix
# The one installed by default doesn't support it
RUN apk add --no-cache tar

ARG MIGRATE_VERSION=4.18.1
ARG MIGRATE_SHASUM="2a08137b4720aa457bc760540723e313783f1fab27473463bdcc5fc2e9252959  migrate.linux-amd64.tar.gz"
RUN curl -L -o migrate.linux-amd64.tar.gz https://github.com/golang-migrate/migrate/releases/download/v${MIGRATE_VERSION}/migrate.linux-amd64.tar.gz && \
    tar xvzf migrate.linux-amd64.tar.gz && \
    echo "$MIGRATE_SHASUM" | sha256sum -c - && \
    mv migrate /usr/local/bin/migrate


ARG TASK_VERSION=3.40.1
ARG TASK_SHASUM="a35462ec71410cccfc428072de830e4478bc57a919d0131ef7897759270dff8f  task_linux_amd64.tar.gz"
RUN curl -L -o task_linux_amd64.tar.gz https://github.com/go-task/task/releases/download/v${TASK_VERSION}/task_linux_amd64.tar.gz && \
    tar xvzf task_linux_amd64.tar.gz && \
    echo "$TASK_SHASUM" | sha256sum -c - && \
    mv task /usr/local/bin/task


ARG GOLANG_CI_VERSION=1.62.2
ARG GOLANG_CI_SHASUM="5101292b7925a6a14b49c5c3d845c5021399698ffd2f41bcfab8a111b5669939  golangci-lint.tar.gz"
RUN curl -L -o golangci-lint.tar.gz https://github.com/golangci/golangci-lint/releases/download/v${GOLANG_CI_VERSION}/golangci-lint-${GOLANG_CI_VERSION}-linux-amd64.tar.gz && \
    tar xvzf golangci-lint.tar.gz --strip-components=1 && \
    echo "$GOLANG_CI_SHASUM" | sha256sum -c - && \
    mv golangci-lint /usr/local/bin/golangci-lint


ARG GOTESTSUM_VERSION=1.12.0
ARG GOTESTSUM_SHASUM="a50939fcfdfbc052bf97ff074c7fd8bcde1745be4a365d12d79311c293f12ae7  gotestsum.tar.gz"
RUN curl -L -o gotestsum.tar.gz https://github.com/gotestyourself/gotestsum/releases/download/v${GOTESTSUM_VERSION}/gotestsum_${GOTESTSUM_VERSION}_linux_amd64.tar.gz && \
    tar xvzf gotestsum.tar.gz && \
    echo "$GOTESTSUM_SHASUM" | sha256sum -c - && \
    mv gotestsum /usr/local/bin/gotestsum


ARG GOMOCK_VERSION=1.6.0
ARG GOMOCK_SHASUM="c73e117943739df5dd89d63fed6e80cb783852a0cc42abc3359d708c2e125b78  gomock.tar.gz"
RUN curl -L -o gomock.tar.gz https://github.com/golang/mock/releases/download/v${GOMOCK_VERSION}/mock_${GOMOCK_VERSION}_linux_amd64.tar.gz && \
    tar xvzf gomock.tar.gz --strip-components=1 && \
    echo "$GOMOCK_SHASUM" | sha256sum -c - && \
    mv mockgen /usr/local/bin/mockgen

