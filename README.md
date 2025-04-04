# StorageAPI

## Motivação
Este projeto foi criado como um exemplo de API utilizando o Cloudflare R2 para armazenamento de objetos e o Keycloak para autenticação e autorização. Ele demonstra como integrar essas tecnologias para construir uma solução escalável e segura.

## Cloudflare R2
O Cloudflare R2 é uma solução de armazenamento de objetos que oferece alta disponibilidade e custo reduzido, sendo uma alternativa ao Amazon S3. Ele é ideal para armazenar grandes volumes de dados, como arquivos, imagens e backups, sem taxas de saída (egress fees). Neste projeto, o R2 é utilizado para gerenciar o armazenamento de arquivos de forma eficiente.

## Keycloak
O Keycloak é uma ferramenta de código aberto para gerenciamento de identidade e acesso. Ele fornece autenticação, autorização e gerenciamento de usuários de forma centralizada. Neste projeto, o Keycloak é usado para proteger a API, garantindo que apenas usuários autenticados possam acessar os recursos.

## Como executar o projeto

1. Certifique-se de ter o Docker e o Docker Compose instalados em sua máquina.
2. Clone este repositório:
  ```bash
  git clone https://github.com/seu-usuario/StorageAPI.git
  cd StorageAPI
  ```
3. Configure as variáveis de ambiente no arquivo `.env` (exemplo incluído no repositório).
4. Inicie os contêineres:
  ```bash
  docker-compose up --build
  ```
5. Acesse a API em `http://localhost:8080` (ou a porta configurada no `docker-compose.yml`).

Agora você pode testar a API e explorar as funcionalidades de integração com o Cloudflare R2 e o Keycloak.
