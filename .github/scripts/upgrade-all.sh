#!/bin/sh

set -eu

channel="$1"

echo "upgrading all packages"

packages=$(find "." -not -path "*/node_modules/*" -type f -name "package.json")

v=$(sh .github/scripts/prisma-version.sh "$channel")

dir=$(pwd)

echo "$packages" | tr ' ' '\n' | while read -r item; do
  case "$item" in
    *".github"*|*"experimental"*|*"deployment-platforms"*)
      echo "ignoring $item"
      continue
      ;;
  esac

  echo "running $item"
  cd "$(dirname "$item")/"

  ## ACTION
  yarn add --ignore-engines "@prisma/cli@$v" --dev
  yarn add --ignore-engines "@prisma/client@$v"
  ## END

  echo "$item done"
  cd "$dir"
done
