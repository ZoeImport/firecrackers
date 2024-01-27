baseDir=$(cd $(dirname $0)/../;pwd)

cd $baseDir/frontend
if [ ! -d "node_modules" ];then
  npm install
fi
npm run build

cd $baseDir/backend
mvn -Pnative -DskipTests clean native:compile