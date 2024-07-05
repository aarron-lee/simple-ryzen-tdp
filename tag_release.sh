#!/usr/bin/bash

git checkout main

if [ "$EUID" -eq 0 ]
  then echo "Please do not run as root"
  exit
fi

NEW_TAG=$1

if [ "${NEW_TAG:0:1}" = "v" ]; then
    echo "First character is 'v'. Please use the Version number only"
    exit
fi

sed -i "s/version\": \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/version\": \"$NEW_TAG\"/" ./package.json

git add ./package.json

git commit -m "Release version $NEW_TAG"

git tag v$NEW_TAG

git push

git push --tags