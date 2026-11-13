#!/bin/zsh
# Keeps the KODI prototype current: kodi_2 main → proto (merge) → static build → pairly-notes/kodi (GitHub Pages).
# Runs every 10 min via ~/Library/LaunchAgents/com.mhkim.kodi-proto-sync.plist. Log: ~/Library/Logs/kodi-proto-sync.log
set -u
export PATH=/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin
REPO=~/Documents/pairly
SITE=~/Documents/pairly-notes
notify() { osascript -e "display notification \"$1\" with title \"KODI prototype sync\"" >/dev/null 2>&1; }
log() { echo "$(date '+%m/%d %H:%M:%S') $*"; }

cd $REPO || exit 1
if [[ -n "$(git status --porcelain --untracked-files=no)" ]]; then log "skip: uncommitted local edits in $REPO"; exit 0; fi
[[ "$(git branch --show-current)" == "proto" ]] || { log "skip: not on proto branch"; exit 0; }

git fetch -q origin || { log "fetch failed"; exit 1; }
git pull -q --ff-only origin proto 2>/dev/null   # pick up proto commits made elsewhere
if git merge-base --is-ancestor origin/main HEAD; then
  log "no new main commits"
else
  NEW=$(git log --oneline HEAD..origin/main | wc -l | tr -d ' ')
  if git merge -q --no-edit -m "Merge kodi_2 main into proto (auto sync)" origin/main; then
    git push -q origin proto && log "merged $NEW main commit(s) into proto"
  else
    git merge --abort
    log "CONFLICT merging main into proto — left untouched"; notify "main ↔ proto conflict. Ask Claude to merge by hand."
    exit 1
  fi
fi

BUILT=$(cat $SITE/kodi/.source 2>/dev/null)
HEAD_SHA=$(git rev-parse --short HEAD)
[[ "$BUILT" == "$HEAD_SHA" ]] && { log "site already at $HEAD_SHA"; exit 0; }

npm install --no-audit --no-fund --silent >/dev/null 2>&1
npm run -s build:pages >/tmp/kodi-build.log 2>&1 || { log "BUILD FAILED (see /tmp/kodi-build.log)"; notify "Prototype build failed."; exit 1; }

cd $SITE && git pull -q --ff-only
rm -rf kodi && cp -R $REPO/dist-pages kodi && echo $HEAD_SHA > kodi/.source
git add -A && git -c user.email="1731778+marco318@users.noreply.github.com" -c user.name="marco318" commit -qm "kodi: auto sync from kodi_2 proto @ $HEAD_SHA" && git push -q && log "published $HEAD_SHA"
