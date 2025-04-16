#!/bin/sh

set -e

LOG_FILE="/home/backup/backups/backup.log"
DATE=$(date +%Y-%m-%d)
FILENAME="keycloak_backup_$DATE.sql.gz"
FILEPATH="/home/backup/backups/$FILENAME"

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_discord_message() {
  MESSAGE="$1"
  curl -H "Content-Type: application/json" \
       -X POST \
       -d "{\"content\": \"$MESSAGE\"}" \
       "$DISCORD_WEBHOOK_URL" >/dev/null 2>&1
}

log "📦 Iniciando backup do PostgreSQL..."

# Executar o dump
if pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" "$POSTGRES_DB" | gzip > "$FILEPATH"; then
  log "✅ Backup criado com sucesso: $FILENAME"
else
  log "❌ Falha ao criar o dump do banco de dados!"
  send_discord_message "❌ **Falha no backup Keycloak!** Não foi possível gerar o dump do banco em $DATE."
  exit 1
fi

# Enviar para R2
log "☁️ Enviando para Cloudflare R2..."
if aws --endpoint-url "$R2_ENDPOINT" s3 cp "$FILEPATH" "s3://$R2_BUCKET/$FILENAME"; then
  log "✅ Upload para R2 concluído com sucesso."
  send_discord_message "✅ **Backup Keycloak concluído com sucesso!** Arquivo: \`$FILENAME\`"
else
  log "❌ Falha no upload para o R2!"
  send_discord_message "❌ **Erro no envio do backup para o R2!** Verifique o container de backup."
  exit 1
fi

log "🏁 Processo de backup finalizado com sucesso."
