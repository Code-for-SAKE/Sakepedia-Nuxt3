#!/bin/bash

METADATA_DIR="./bkp/storage_export/metadata"
BLOBS_DIR="./bkp/storage_export/blobs"
BUCKET_FILE="./bkp/storage_export/buckets.json"

# バケット名を取得
BUCKET_NAME=$(grep -oP '"id":\s*"\K[^"]+' "$BUCKET_FILE" | head -n 1)
BUCKET_NAME="gs://$BUCKET_NAME" # gs:// プレフィックスを追加

# メタデータのファイルをループ
for metadata_file in "$METADATA_DIR"/*.json; do
  # メタデータを読み込む
  metadata=$(cat "$metadata_file")
  # name プロパティを取得
  file_name=$(echo "$metadata" | grep -oP '"name":\s*"\K[^"]+') 

  blob_file_name=$(basename "$metadata_file" .json) # 拡張子を省略
  # blobs フォルダ内のバイナリファイルのパス
  local_blob_path="$BLOBS_DIR/$blob_file_name"

  # ファイルが存在するか確認してアップロード
  if [[ -f "$local_blob_path" ]]; then
    gcloud storage cp "$local_blob_path" "$BUCKET_NAME/$file_name"
    echo "Uploaded: $local_blob_path to $BUCKET_NAME/$file_name"
  else
    echo "Blob not found: $local_blob_path"
  fi
done