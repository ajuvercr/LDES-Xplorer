if [ -f ".env.local" ]; then
  . .env.local
fi
if [ -f "dotenv/production" ]; then
  echo $(pwd)
source dotenv/production
fi
HOST=${HOST:-localhost}
PORT=${PORT:-4000}
ORIGIN=${ORIGIN:-"$HOST:$PORT"}

PORT=${PORT} HOST=${HOST} ORIGIN=${ORIGIiN} node build/index.js
