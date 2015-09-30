cd ~/Downloads
wget http://apache.mirrors.timporter.net/maven/maven-3/3.1.1/binaries/apache-maven-3.1.1-bin.tar.gz

sudo mkdir -p /usr/local/apache-maven
sudo mv apache-maven-3.1.1-bin.tar.gz /usr/local/apache-maven
cd /usr/local/apache-maven
sudo tar -xzvf apache-maven-3.1.1-bin.tar.gz