class setup {
    constructor(){
        this.imageTag = "tezsureinc/tezster:1.0.0";
        this.containerName = "tezster";
        this.helper = new Helper();
        this.docker = new Docker({  protocol: 'https',socketPath: "/var/run/docker.sock" });
    }
    __setup(args){
        this.checkDockerVersion = "docker --version";
        this.checkDirConfigCmd = `stat -c '%a %n' ${__dirname}/config.json`;
        this.checkDirPermissionCmd = `sudo chmod -R 777 ${__dirname}/config.json`;
        this.outputText = "We may need your password for write permission in config file....";
        this.helper.outputInfo(this.outputText);
        this.dockerParams = {
            ...args,
            command : this.checkDockerVersion
        }
        this.helper.executeChildProcess(this.dockerParams)
        .then(response => {
            this.dockerParams.command = this.checkDirConfigCmd;
            return this.helper.executeChildProcess(this.dockerParams);
        })
        .then(response => {
            if (response !== `777 ${__dirname}/config.json`){
                this.dockerParams.command = this.checkDirPermissionCmd;
                return this.helper.executeChildProcess(this.dockerParams);
            }
        })
        .catch(error => {
            this.helper.outputError(error)
        });
    }
}

module.exports = {
    NewSetup: setup
}