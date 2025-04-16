FROM postgres:17-alpine

LABEL maintainer="Seu Nome Intime Sistemas"

# Instalar dependências e aws-cli v2
RUN apk --no-cache add \
      curl \
      unzip \
      groff \
      less \
      python3 \
      py3-pip && \
    pip3 install --upgrade pip && \
    pip3 install awscli

# Criar diretório de trabalho
WORKDIR /home/backup

# Copiar script para dentro da imagem (opcional, caso queira embutir)
COPY backup.sh .

# Dar permissão
RUN chmod +x backup.sh

ENTRYPOINT ["./backup.sh"]
