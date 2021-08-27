#!/bin/bash

# ONCE 4.3.0 test/sprint21

export PS4='+${LINENO}: '
#source 'lib.trap.sh'
#DEBUG=ON


This=$(which $0)
this=$(basename $This)

once.version()              # prints out the hard coded version tag of $This | to update the script use e.g. once update here http://192.168.178.49:8080
{
 console.log "$0 version: 20210611 14:38"
}

if ! [ -x "$(command -v debug)" ]; then
  onError() {
    rc=$?
    echo "ERR at line ${LINENO} (rc: $rc)"
    step
    exit $rc
  }

  function stepDebugger()     # steppes through the once.sh script 
  {
      export PS4='+${LINENO}: '
      echo " function ${FUNCNAME[0]}($1)"
      if [ "$1" = "ON" ]; then
          echo step debugger is now ON
          trap step DEBUG
      fi
      if [ "$1" = "OFF" ]; then
            trap "" DEBUG
            DEBUG=OFF
            trap
            echo "cleard TRAP DEBUG"
            export DEBUG=
            set +x
      fi
  }

  function step {
    set +x
    if [[ -n "$BASH_COMMAND" ]]; then
      echo "<-----------------------------------------"
      echo \> \'$BASH_COMMAND\'
      read -p '' CONT

      #warn.log "Cont: $CONT"

      if [[ ! "$CONT" = "" ]]; then
          case $CONT in
              h)
                  echo "
                  h     this help
                  n     next command   
                  ENTER silent next command

                  d     toggle debug messages
                  s     continue silently
                  c     in full debug
                  p     print PATH
                  ll    list dir
                  cd    changing to entered path
                  r     tree root
                  home  tree home
                  i     check eamd
                  eamd  tree workspace

                  cmd   runn command (BE CAREFULL)

                  all other commands exit
                  "
                  step
                  ;;
              p)
                  console.log "PATH=$PATH"
                  step
                  ;;
              s)
                  trap "" DEBUG
                  trap
                  echo "cleard TRAP DEBUG"
                  export DEBUG=
                  set +x
                  ;;
              ll)
                  pwd
                  ls -alF
                  step
                  ;;
              r)
                  tree -aL 2 /root
                  step
                  ;;
              home)
                  tree -aL 2 /home
                  step
                  ;;
              eamd)
                  tree -aL 2 /$defaultWorkspace/..
                  step
                  ;;
              i)
                  eamd check
                  step
                  ;;
              cd)
                  read -p 'cd to?   >' CD_DIR
                  cd $CD_DIR
                  step
                  ;;
              cmd)
                  read -p 'command?  BE CAREFULL >' command
                  set -x
                  $command
                  step
                  ;;

              c)
                  trap "" DEBUG
                  trap
                  echo "cleard TRAP DEBUG"
                  export DEBUG=
                  set -x
                  ;;
              d)
                if [ "ON" = "$DEBUG" ]; then 
                  DEBUG=OFF
                else
                  DEBUG=ON
                fi
                warn.log "Toggeld DEBUG to $DEBUG"
                  step
                  ;;
              n)
                echo "      next..."
                set -x
                ;;
              *)
                  warn.log "Exiting prematurely because of command $CONT"
                  exit 1
                  ;;
          esac
      else
        set +x
      fi
      #warn.log "$CONT"
      #set -x
    fi
  }


  once.makeAnError() 
  {
    echo "i will make an error now"
    asldkj;asdf
    echo "ups, what happend ;)"
  }
else
  echo "sourcing $(which debug)"
  source debug
fi

if ! [ -x "$(command -v warn.log)" ]; then
    echo "no warn.log.... mitigated using internal functions...status: ok"
    debug.log() {
	    if [ "ON" = "$DEBUG" ]; then
            test -t 1 && tput setf 7     
            echo "- $*"
            test -t 1 && tput sgr0 # Reset terminal
        fi
    }
    console.log() {
        test -t 1 && tput bold; tput setf 7                                            ## white bold
        echo ">  $*"
        test -t 1 && tput sgr0 # Reset terminal
    }
    err.log() {
        test -t 1 && tput bold; tput setf 4  
        echo "ERROR>  $*"
        test -t 1 && tput sgr0 # Reset terminal
    }
    warn.log() {
        test -t 1 && tput bold; tput setf 6                                    ## white yellow
        echo "> WARNING $*"
        test -t 1 && tput sgr0 # Reset terminal
    }
fi


once.1() {
  console.log "hello ${FUNCNAME[0]} ..."
  
  echo "$1 should be \"a\"" 
  a=$1 
  shift
  b=$1
  echo "$1 should be \"b\""
  shift
  c=$1
  echo "$1 should be \"c\""
  shift

  RETURN=$1

}
once.2() {
  debug.log "hello ${FUNCNAME[0]} ..."
  echo "$1 should be \"d\""
  shift
  echo "$1 should be \"e\""
  shift
  RETURN=$1
}
once.3() {
  console.log "hello ${FUNCNAME[0]} ..."
  echo "$1 should be \"f\""
  shift
  echo "$1 should be \"g\""
  shift
  RETURN=$1
}
once.4(){
  grep -w '$1' /root/scripts/once
  export st=$?
  if [ $st = 1 ] && [ $1 != 'cmd']; then
    once $1
    shift
  else
    once cmd $1
    shift
  fi
}




once.discover()             # discovers the environment the current once instance is hosted in
{
  # stepDebugger ON

  if [ -z "$USERHOME" ]; then
    USERHOME=$(cd;pwd)
  fi

  startDir=$(pwd)

  once.isInDocker
  
  echo "Once.discover:
  current shell : $SHELL  (level $(($SHLVL/2)))
          script: $0
          dir   : $startDir
          home  : $USERHOME
        hostname: $HOSTNAME
          type  : $HOSTTYPE
          OS    : $OSTYPE"

  if [[ $startDir =~ "EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once" ]]; then
    warn.log "once.sh started from \$ONCE_DIR: $startDir"
    #once.repair
  fi


  if [ -z "$ONCE_DEFAULT_SCENARIO" ]; then
      #console.log "emergency read once state from user home"
      if [ -f ~/.once ]; then
        source ~/.once
      else
        console.log "no .once nor sceanrio discovered: once init..."
        once.init
        return
      fi
  fi


  if [ -f $ONCE_DEFAULT_SCENARIO/.once ]; then
	  source $ONCE_DEFAULT_SCENARIO/.once
    echo "          PM    : $ONCE_PM
    "
	  console.log "Once.init with: $ONCE_DEFAULT_SCENARIO/.once"
    once.update.variables
    #console.log "once stage to: $ONCE_STATE"
	  #once.stage $ONCE_STATE 
  else
    once.init
    once.stage
  fi
  #checkAndFix "is privileged" " ~ = '/root' " "" "ONCE_PRIVILIDGE=root"
}

once.v()                    # prints out the current version of once - alias for once version 
{
  once.version
}

once.ca()                # checks if and where the simple mkcert Root CA is installed 
{
  # https://github.com/FiloSottile/mkcert
  # https://blog.filippo.io/mkcert-valid-https-certificates-for-localhost/
  once.cmd mkcert 
  if [ -z "CAROOT" ]; then 
    once.ca.install
  fi
  console.log "Root CA installed in: $(mkcert -CAROOT)"
}

once.ca.install()         # installs the simple mkcert Root CA
{
  CAROOT=$SCENARIOS_DIR/rootCA/mkcert
  console.log "Installing Root CA mkcert in: $CAROOT"
  export CAROOT
  mkcert -install
  NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
  export NODE_EXTRA_CA_CERTS
  ONCE_EXPORT_NODE_EXTRA_CA_CERTS=$NODE_EXTRA_CA_CERTS
  ONCE_EXPORT_CAROOT=$CAROOT
  
  once.hibernate update
}

once.cu()                  # certifcate update for localhost for the Once Server
{
  once.localhost.certificates
}

once.localhost.certificates() # creates localhost cerifikates for the Once Server
{
  once.ca
  #cd $ONCE_DIR
  cd $ONCE_DEFAULT_SCENARIO
  mkcert -cert-file once.cert.pem -key-file once.key.pem -p12-file once.pfx  server.localhost localhost 127.0.0.1 ::1
}

once.scu()
{
  once.copy.cerbot.certificates "$1"
  shift
  RETURN=$1
}

once.copy.cerbot.certificates()
{
  cd $ONCE_DEFAULT_SCENARIO
  local hostname=$ONCE_DEFAULT_HOST
  if [ -n "$1" ]; then
    console.log "Setting hostname to: $1"
    hostname=$1
    shift
  fi
  checkAndFix "delete once.cert.pem" -f "once.cert.pem" "rm once.cert.pem" 
  checkAndFix "delete once.key.pem" -f "once.key.pem" "rm once.key.pem" 

  checkAndFix "$hostname once.cert.pem" -L "once.cert.pem" "ln -s ../../Docker/CertBot/1.7.0/config/conf/archive/$hostname/cert1.pem once.cert.pem" 
  checkAndFix "$hostname once.key.pem" -L "once.key.pem" "ln -s ../../Docker/CertBot/1.7.0/config/conf/archive/$hostname/privkey1.pem once.key.pem" 
}


function once.repair()      # (CAUTION> not fully tested) should be executed from the ONCE Directory. Will repair settings for the current checked out Repository 
{
    local dir=$1
    if [ -z "$dir" ]; then
      dir=$ONCE_DIR
    else
      shift
    fi
    cd $dir
    console.log "   starting repair mode:"
    console.log "       This: $This
          this: $this
      ONCE_DIR: $dir
           pwd: $(pwd)
    "
    #set -x
    while [ ! $(basename $(pwd)) == "EAMD.ucp" ]; do
      console.log $(basename $(pwd))
      cd ..
    done
    cd ..
    ONCE_REPO_PREFIX=$(pwd)
    console.log "ONCE_REPO_PREFIX: $ONCE_REPO_PREFIX"
    rm -Rf ~/scripts.old
    mv ~/scripts ~/scripts.old
    rm ~/.bashrc
    once.clean up
    cd
    ln -s $ONCE_REPO_PREFIX/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/NewUserStuff/scripts
    #ln -s ~/scripts/templates/.bashrc
    cp ~/scripts/templates/.bashrc ~/.bashrc

    ONCE_DEFAULT_SCENARIO=
    RETURN=$1
    #cd $ONCE_REPO_PREFIX/EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once/latestServer/src/sh
    #once.update here
    #exit 0
}


function once.isInDocker()  # checks if the script is executed in a docker container
{
    echo "is in docker?"
    if [ -z "$HOSTNAME" ]; then
      HOSTNAME=$(hostname)
    fi

    if [ -f /.dockerenv ]; then
      console.log "inside of docker"
      ONCE_MODE=IN_DOCKER
      if [ -n "$ONCE_DOCKER_HOST"  ]; then
        console.log "found ONCE_DOCKER_HOST: $ONCE_DOCKER_HOST"
        HOSTNAME=$ONCE_DOCKER_HOST
        console.log "usineg it as HOSTNAME: $HOSTNAME"
      else
        if [ ! "$ONCE_DOMAIN" = ".docker.local" ]; then
          ONCE_DOMAIN=".docker.local"
          HOSTNAME=$HOSTNAME$ONCE_DOMAIN
        fi
      fi
    else
      if [ "$ONCE_MODE" = "IN_DOCKER" ]; then
        ONCE_MODE=DOCKER
      fi
      console.log "  ONCE_MODE=$ONCE_MODE on host $HOSTNAME"
    fi
}


once.help()                 # prints a list of all commands for once
{
  local detail=$1
  if [ -n "$detail" ]; then
    shift
  fi
  grep "^once\.$detail.*()" $This | sort
  exit 0
}

once.superuser()            # prints a list of all the advanced superuser functions in once.sh
{
  local detail=$1
  if [ -n "$detail" ]; then
    shift
  fi
  console.log "This are the advanced funtions for superusers in $This:"
  grep "^function once\.$detail.*()" $This | sort
  exit 0
}
once.su()                   # alias to once.superuser to list advanced functions ot $This
{
  once.superuser
}

function checkAndFix()      # checkes and fixing/adding files
{
    debug.log "checkAndFix(1:$1 2:$2 3:$3 4:$4  silent:$5)"
    if [ $2 "$3" ]; then
        if [ -z "$5" ]; then
    	    echo "check: ok     : $1: $3"
        fi
    else
        if [ -z "$5" ]; then
          echo "check: failed : $1: $3        ...fixing with: $4"
        fi
        $4
    fi
}




once.cmd()                  # checks if the <command> is available or is being installed via the package manager in $ONCE_PM, if the package name is diffrent it can be specify with e.g. once cmd ssh openssl 
{

    current=$1
    shift
    package=$1
    shift

    if [ -z "$package" ]; then
        package=$current
    else
      shift
      package=$1
    fi   

    if [ -z "$ONCE_PM" ]; then
      console.log "no PM found...checking" 
      once.check.all.pm
    fi
    if ! [ -x "$(command -v $current)" ]; then
        console.log "no $current"
        if [ -n "$ONCE_PM" ]; then
          case $current in
            eamd)
              once.load $current tla/EAMD/UcpComponentSupport/1.0.0/src/sh/eamd
              ;;
            oosh)
              once.load $current com/ceruleanCircle/EAM/1_infrastructure/OOSH/1.0.0/src/sh/oosh
              ;;
            once)
              once.load once.sh tla/EAM/layer1/Thinglish/Once/latestServer/src/sh/once.sh
              cd $ONCE_LOAD_DIR
              mv once.sh once
              once.stage status
              ;;
            npm)
              once.npm.install
              ;;
            *)
              $ONCE_PM $package
            esac
        else
            console.log "no package manger"
        fi
        shift
    fi
    RETURN=$@
}
once.load()                 # loads ONCE Object Orioented SHell components (scripts) e.g: once load paths
{

  #set -x
  echo load $1
  ONCE_LOAD_DIR=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer/oosh
  once.path.create $ONCE_LOAD_DIR
  cd $ONCE_LOAD_DIR/
  if [ -f "$1" ]; then
    rm $1.*
    console.log "WARNING: the file is already downloaded: $ONCE_LOAD_DIR/$1"
    console.log "Please add it to the PATH with running:   . once path"
  else
    #once.path
    once.cmd wget
    local url=$ONCE_DEFAULT_URL
    if [ -n "$ONCE_LOCAL_SERVER" ]; then
      url=$ONCE_LOCAL_SERVER
    fi

    wget $url/$ONCE_REPO_NAME/$ONCE_REPO_COMPONENTS/$2
    chmod 744 $1
    #set +x
    #once.stage done
  fi
}

function once.npm.install() 
{
      curl -sL https://deb.nodesource.com/setup_16.x | bash -
      $ONCE_PM nodejs
      once.npm.update.shell
}

function once.npm.update.shell()      # updates the shell used bey npm to /bin/bash    (on trouble with '. .once' or 'source .once' )
{
  npm config set script-shell /bin/bash
} 


function once.check.pm()             # checks for a package manager
{

    local packageManager=$1
    local packageManagerCommand=$2


    if [ -z "$packageManagerCommand" ]; then
        package=$packageManager
    fi   
    if ! [ -x "$(command -v $packageManager)" ]; then
        debug.log "no $packageManager"
    else
        if [ -z "$ONCE_PM" ]; then
            export ONCE_PM=$packageManagerCommand
            export groupAddCommand=$3
            export userAddCommand=$4
            echo "Package Manager found: using $ONCE_PM somePackage"
            if [ "$packageManager" = "apt-get" ]; then
                if [ -z "$ONCE_PM_UPDATED" ]; then
                  ONCE_PM_UPDATED="apt-get update"
                  $ONCE_PM_UPDATED
                else
                  echo "in case of installation errors try to call: apt-get update"
                fi
            fi
        fi
    fi
}
function once.check.all.pm()         # adds tools and configurations to package manager (brew, apt-get, addgroup, adduser, dpkg, pkg)
{

    once.check.pm brew "brew install"    
    #once.check.pm apt "apt add"
    once.check.pm apt-get "apt-get -y install" "groupadd -f" "useradd -g dev"
    once.check.pm apk "apk add" "addgroup" "adduser -g dev"
    once.check.pm dpkg "dpkg install"
    once.check.pm pkg "pkg install"
    once.check.pm pacman "pacman -S"

 
}
function once.pm()                   # calls package manager 
{

  ONCE_PM=
  once.check.all.pm
  console.log "PM: $ONCE_PM"

  RETURN=$1
}


once.check.scenario() 
{
  if [ -n "$ONCE_DEFAULT_SCENARIO" ]; then
    console.log "Setting ONCE_DEFAULT_SCENARIO to: $SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer"
    export ONCE_DEFAULT_SCENARIO=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer
    once.hibernate update 
  fi
}

once.scenario()             # forces re-discovery of the current environment and scenario configuration 
{
  once.cmd eamd
  #once.path

  cd $ONCE_DEFAULT_SCENARIO
  local hostname=$HOSTNAME
  if [ -n "$1" ]; then
    console.log "Setting hostname to: $1"
    hostname=$1
    shift
  fi
  debug.log h:$hostname- H:$HOSTNAME-
  #stepDebugger ON

  eamd call loop $hostname . reverse x log . r / save once.scenario
  ONCE_SCENARIO=$SCENARIOS_DIR/$(cat once.scenario)
  console.log "ONCE_SCENARIO=$ONCE_SCENARIO"
  ONCE_DOMAIN=$(find $ONCE_SCENARIO -type d -name CertBot -exec find {}/1.7.0/config -mindepth 1 -maxdepth 1 -type d \;)
  #console.log "-ONCE_DOMAIN=-$ONCE_DOMAIN-"
  if [ -n "$ONCE_DOMAIN" ]; then
    eamd call loop $ONCE_DOMAIN / silent x result $startDir/.tmp.result.list.env
    . $startDir/.tmp.result.list.env
    ONCE_DOMAIN=$lastItem
    
    #ONCE_DEFAULT_SERVER=$ONCE_DOMAIN
    ONCE_DEFAULT_HOST=$ONCE_DOMAIN
    
    console.log "ONCE_DOMAIN=$ONCE_DOMAIN"
    eamd call loop $ONCE_DOMAIN . reverse x log . r / save once.domain
    ONCE_DOMAIN=$(cat once.domain)
    ONCE_SCENARIO=$ONCE_SCENARIO/vhosts/$ONCE_DOMAIN

    console.log "ONCE_SCENARIO=$ONCE_SCENARIO"
    rm once.scenario
    rm $startDir/.tmp.result.list.env
    rm once.domain
    tree $ONCE_DEFAULT_SCENARIO
  fi
  ONCE_SCENARIO=$ONCE_SCENARIO/EAM/1_infrastructure/Once/latestServer
  ONCE_DEFAULT_SCENARIO=$ONCE_SCENARIO
  checkAndFix  "default ONCE_DEFAULT_SCENARIO location" "-d" "$ONCE_DEFAULT_SCENARIO" "once.path.create $ONCE_DEFAULT_SCENARIO"
  checkAndFix  "checking if .once.env link exist" "-L" "$ONCE_DEFAULT_SCENARIO/.once.env" "ln -s $ONCE_DEFAULT_SCENARIO/.once $ONCE_DEFAULT_SCENARIO/.once.env"
  
  once.paths.reset
  once.paths.save

}

function once.find()                 # finds all running node servers
{
  ps aux | grep Once
}

function once.check.installation()   # checks for a once installation in given path
{

  checkAndFix "exists $ONCE_REPO_PREFIX" "-d" "$ONCE_REPO_PREFIX" "once.path.create $ONCE_REPO_PREFIX"

  once.pm
  checkAndFix "make once alias $(which $0)" -L "$(dirname $(which $0))/once" "ln -s $(which $0) $(dirname $(which $0))/once" 
  once.cmd wget
  once.cmd curl
  once.cmd git
  once.cmd eamd

  once.stage ssh.init


  if [ -d $COMPONENTS_DIR ]; then
    console.log "Repository found at $COMPONENTS_DIR..."
    console.log "discover scenario..."
    once.stage scenario
    #once paths.reset paths.save
  else
    console.log "Repository NOT FOUND at $COMPONENTS_DIR..."
    once.stage repo.init
  fi
  
  once.stage installed
}

function once.installed()            # prints where the repository has been installed 
{

  console.log "Repository is installed at: $ONCE_REPO_PREFIX/$ONCE_REPO_NAME"
  once.stage server.start
}
  
function once.server.start()         # starts the once server if not already up and running
{
  once.isInDocker
  console.log "once start in mode $ONCE_MODE with option $@"

  if [ "$ONCE_MODE" = "IN_DOCKER" ]; then
    if [ -f /.dockerenv ]; then
      once.server.start.inDocker
      return
    else
      once.server.start.docker
      return
    fi
  fi

  if [ "$ONCE_MODE" = "DOCKER" ]; then
    once.server.start.docker
    return
  fi

  if [ "$ONCE_MODE" = "LOCAL" ]; then
    once.server.start.local "$@"
    return
  fi

  err.log "UNKNOWN ONCE_MODE: $ONCE_MODE"
  
}

function once.server.start.local()
{
  if [ "$1" = "start" ]; then 
    shift
    RETURN=$1
  fi

  if [ -n "$ONCE_SERVER_PID" ]; then
    if [ "$1" != "new" ]; then  
      console.log "Server is already up: $ONCE_SERVER_PID";
      once.cat
      shift
      RETURN=$1
      return 
    fi
  fi 
  once.cmd npm

  cd $ONCE_DIR
  console.log "Starting Once Server in: $(pwd)"
  console.log "   option: $@"

  if [ "$1" != "fast" ]; then 
    npm update
  else 
    shift
  fi
    
  nohup node -r dotenv/config src/js/Once.class.js dotenv_config_path=$ONCE_DEFAULT_SCENARIO/.once.env &>$ONCE_DEFAULT_SCENARIO/once.log &

  ONCE_STATE=state
  ONCE_SERVER_PID="$ONCE_SERVER_PID $!"
  once.hibernate update

  console.log "Once Server up as PID: $ONCE_SERVER_PID"
  RETURN=$1
}
function once.server.start.docker()
{
  cd $COMPONENTS_DIR/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nodejs/14
  console.log "Starting Once Server in: $(pwd)"
  runDocker
}
function once.server.start.inDocker()
{
  once.server.start.local
}

function once.server.stop()          # stops the server 
{
  once.isInDocker
  console.log "once stop in mode $ONCE_MODE"

  if [ "$ONCE_MODE" = "IN_DOCKER" ]; then
    if [ -f /.dockerenv ]; then
      once.server.stop.process 
      return
    else
      once.server.stop.docker
      return
    fi
  fi

  if [ "$ONCE_MODE" = "DOCKER" ]; then
    once.server.stop.docker
    return
  fi

  if [ "$ONCE_MODE" = "LOCAL" ]; then
    once.server.stop.process $@
    return
  fi

  err.log "UNKNOWN ONCE_MODE: $ONCE_MODE"


}

function once.server.stop.docker()   
{
  cd $COMPONENTS_DIR/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nodejs/14
  console.log "stoping Once Server Docker Container from: $(pwd)"
  docker-compose stop
}

function once.server.stop.process()          # stops the server 
{
  if [ -n "$1" ]; then
    console.log "Setting Once Server PID to: $1"
    ONCE_SERVER_PID=$1
  fi
  console.log "Stopping Once Server with PID: $ONCE_SERVER_PID"
  
  kill -SIGTERM $ONCE_SERVER_PID
  
  ONCE_STATE=check.installation
  ONCE_SERVER_PID=
  once.hibernate update
}
once.state()                # lists the current state of the once server and the current configuration alias to once state 
{

  once.version
  console.log "read state from ONCE_DEFAULT_SCENARIO: $ONCE_DEFAULT_SCENARIO
  "
  cat $ONCE_DEFAULT_SCENARIO/.once
  once.config.list

  if [ -n "$ONCE_SERVER_PID" ]; then
    console.log "EOF

  Once Server is up.
    Stop      it with: $0 stop <?PID:$ONCE_SERVER_PID>
    Log       it with: $0 log
    Get Log file with: $0 cat
    "
  else
    console.log "EOF

  Once Server is down...
    ";
  fi
}

once.server()
{
    if [ -z "$1" ]; then 
        tree -L 1 $ONCE_DIR/..
        return
    fi

    cd $ONCE_DIR/..
    local version=$1
    if [ -d $version ]; then
      checkAndFix "remove latestServer"  "! -L" "latestServer" "rm latestServer"
      checkAndFix "set    latestServer"  "-d" "latestServer" "ln -s $version latestServer"
      ONCE_DIR=$COMPONENTS_DIR/tla/EAM/layer1/Thinglish/Once/$version
      once.update.variables
      tree -L 1 $ONCE_DIR/..
      once.stage done
    else
      err.log "Once Version $version not found"
    fi

}

once.client()
{
    if [ -z "$1" ]; then 
        tree -L 1 $ONCE_DIR/..
        return
    fi

    cd $ONCE_DIR/..
    local version=$1
    if [ -d $version ]; then
      checkAndFix "remove latestClient"  "! -L" "latestClient" "rm latestClient"
      checkAndFix "set    latestClient"  "-d" "latestClient" "ln -s $version latestClient"
      tree -L 1 $ONCE_DIR/..
      once.stage done
    else
      err.log "Once Version $version not found"
    fi

}

function once.check.privileges()     # checks the administrative rights of the current once instance 
{

  if [ "$USERHOME" != "/root" ]; then
    once.stage user
  else
    once.stage root
  fi
  once.update.variables
  once.hibernate update

  once.stage
}

function once.root()                 # populates the environmental variables with root administrative rights 
{
    ONCE_PRIVILEGE=root
    ONCE_REPO_PREFIX=/var/dev
    ONCE_STATE=root.installation
}

function once.root.installation()    # installs the repo as root user
{
  once.check.installation
}

function once.user()                 # populates the environmental variables with user administrative rights 
{
    ONCE_PRIVILEGE=user
    ONCE_REPO_PREFIX=$USERHOME/dev
    ONCE_STATE=user.installation
    if [ -z "ONCE_SUDO" ]; then 
      ONCE_SUDO="sudo"
    fi
    ONCE_PM="sudo $ONCE_PM"

}

function once.user.installation()    # installs the repo as a user
{
  if [ -d /var/dev ]; then
      ONCE_REPO_PREFIX=/var/dev
  fi
  once.check.installation
}

function once.path.create()          # creates respective paths
{

    console.log " function ${FUNCNAME[0]}($1) $@"


    if [[ "$1" = /* ]]; then
        cd "/"
    fi

    path=""
    console.log "creating path in $(pwd)"

    for current in ${1//// }; do

        if [ -z "$path" ]; then
            path=$current
        else
            path=$path/$current
        fi
        debug.log "checking path: $path"

        once.createDir $path
    done
}

function once.createDir()            # creates respective directory requested in parameter 
{

    local current=$1
    if [ ! -d $current ]; then
        debug.log "$current does not exist: creating it..."
        mkdir -p $current
    fi
}

function once.ssh.init() 
{
  once.path
  rm scripts.zip*
  
  eamd v
  #stepDebugger ON

  
  if [ ! "$?" = "0" ]; then
    exit $?
  fi
  
  if [ ! -f "~/.ssh/id_rsa" ]; then
    eamd oinit ssh
  fi
}

function once.repo.init()            # forces reinitialisation 
{

  console.log "initialize Repository in $ONCE_REPO_PREFIX"
  cd $ONCE_REPO_PREFIX
  #checkAndFix  "default $ONCE_REPO_PREFIX Repository location" "-d" "$ONCE_REPO_PREFIX" "once path.create $ONCE_REPO_PREFIX"
  #checkAndFix  "default $ONCE_REPO_NAME Repository location" "-d" "$COMPONENTS_DIR" "once path.create $COMPONENTS_DIR"
  #checkAndFix  "default $ONCE_REPO_NAME Repository location" "-d" "$COMPONENTS_DIR" "once path.create $COMPONENTS_DIR"
  #checkAndFix  "default ONCE_DEFAULT_SCENARIO location" "-d" "$ONCE_DEFAULT_SCENARIO" "once path.create $ONCE_DEFAULT_SCENARIO"

  eamd oinit components

  mv $ONCE_REPO_PREFIX/Backup.$ONCE_REPO_NAME/$ONCE_REPO_SCENARIOS $ONCE_REPO_PREFIX/$ONCE_REPO_NAME.previous
  rmdir $ONCE_REPO_PREFIX/$ONCE_REPO_NAME
  mv $ONCE_REPO_PREFIX/$ONCE_REPO_NAME.previous $ONCE_REPO_PREFIX/$ONCE_REPO_NAME
  rmdir $ONCE_REPO_PREFIX/Backup.$ONCE_REPO_NAME
  rm ~/scripts/eamd
  
  cd $ONCE_REPO_PREFIX/$ONCE_REPO_NAME
  git config --global user.email "freemiumuser@example.com"
  git config --global user.name "freemium user"
  git stash -u 
  git checkout -t origin/$ONCE_SCENARIO_BRANCH

  if [ "$ONCE_PRIVILEGE" = "root" ]; then
    conslole.log "root privileges detected...: fixing group rights on repository"
    chown -R $USER:dev $ONCE_REPO_PREFIX
    chmod -R g+wx $ONCE_REPO_PREFIX
    ls -alF $ONCE_REPO_PREFIX
    console.log "    done"
  fi

}

once.log()                  # opens the once log file and continues monitoring 
{

  tail -f $ONCE_DEFAULT_SCENARIO/once.log
  once.done
}

once.cat()                  # prints the current once log file to the console and exits 
{

      cat $ONCE_DEFAULT_SCENARIO/once.log
      once.done
}
once.status()               # lists the current state of the once server and the current configuration alias to once state 
{

  once.state "$@"
}

once.stop()                 # stops the server... if $ONCE_PID is wrong it can be overwritten by specifying the optional PID parameter  
{

  once.server.stop "$@"
}

function once.list.www()             # tries to find domain configurations on the current server location 
{

  #tree -dL 2 /var/www
  #find $SCENARIOS_DIR -type d -name CertBot -exec tree -d {}/1.7.0/config \;
  console.log $HOSTNAME
  find $SCENARIOS_DIR -type d -name CertBot -exec find {}/1.7.0/config -mindepth 1 -maxdepth 1 -type d  \;
  once.done
}

once.path()                 # sets the path to the scripts to be loaded by once as well the sources of the $ONCE_ environment variables  
{

  checkAndFix  "default ONCE_DEFAULT_SCENARIO location" "-d" "$ONCE_LOAD_DIR" "once.path.create $ONCE_LOAD_DIR"
  #once.cmd eamd
  if [ -z "$ONCE_PATHS" ]; then 
    once.paths.reset

    console.log "exported PATH: $PATH
    make sure you called this command as ". $this path"
    "

    ONCE_PATHS=$ONCE_DEFAULT_SCENARIO/paths
    checkAndFix "set ONCE_SHELL_RC: $ONCE_SHELL_RC" "-n" "$ONCE_SHELL_RC" "export ONCE_SHELL_RC=$HOME/.$(basename $SHELL)rc"
    
    echo "
    echo load path configuration for once:
    source ~/.once
 
    cat ~/.once
    echo ' 
    
    Welcome to Web 4.0
    
    '
    " >>$ONCE_SHELL_RC
    ONCE_PATHS=$ONCE_DEFAULT_SCENARIO/paths
    hash -r ## rescan PATH
    NEW=" entering $ONCE_SHELL"

    once.hibernate update
  else
    console.log "PATH will be loaded from $ONCE_PATHS"
    console.log "current PATH=$PATH"
  fi

  #once.done
}

function once.paths.reset()                # reset path 
{
    ONCE_PATHS=
    PATH=.:~/scripts:$ONCE_INITIAL_PATH:$ONCE_DEFAULT_SCENARIO/oosh/:\$ONCE_REPO_PREFIX/\$ONCE_REPO_NAME/\$ONCE_REPO_COMPONENTS/com/ceruleanCircle/EAM/1_infrastructure/OOSH/1.0.0/src/sh:$ONCE_LOAD_DIR:\$ONCE_REPO_PREFIX/\$ONCE_REPO_NAME/\$ONCE_REPO_COMPONENTS/com/ceruleanCircle/EAM/1_infrastructure/NewUserStuff/scripts
    export PATH
    console.log "reset path to: PATH=$PATH"
}

once.clean()                # uninstalls once and removes the current .once configuration. Afterwards once.sh has to be used to reinstall
                            # removes all .once configurations from all scenarios
{

  rm ~/.once
  rm $ONCE_DEFAULT_SCENARIO/.once
  #mv $ONCE_DEFAULT_SCENARIO/paths $ONCE_DEFAULT_SCENARIO/paths.bak
  #rm ~/scripts/eamd
  local this=$0
  checkAndFix "remove once alias $this" "! -L" "$(dirname $this)/once" "rm $(dirname $this)/once" 
  rm -Rf $ONCE_LOAD_DIR
  if [ "$1" = "all" ]; then
    console.log "force deleting $SCENARIOS_DIR"
    rm -Rf $SCENARIOS_DIR
  fi
  
  if [ "$1" = "remove" ]; then
    console.log "force cleaning all environments"
    find $SCENARIOS_DIR -name .once -print
    find $SCENARIOS_DIR -name .once -exec rm {} \;
    find $SCENARIOS_DIR -name paths -exec rm {} \;
  fi
  
  if [ ! "$1" = "up" ]; then 
    exit 0 
  fi
}

once.config()               # starts vim to edit the current .once config 
{
  once.cmd vim
  vim $ONCE_DEFAULT_SCENARIO/.once
  once.update.variables
  once.config.list
}

once.config.list()          # prints a list of configurations (COMPONENTS_DIR, REPO_DIR, SCENARIOS_DIR, ONCE_DIR, ONCE_DEFAULT_SCENARIO, ONCE_LOAD_DIR)
{
  echo COMPONENTS_DIR=$REPO_DIR/$ONCE_REPO_COMPONENTS
  echo REPO_DIR=$ONCE_REPO_PREFIX/$ONCE_REPO_NAME
  echo SCENARIOS_DIR=$REPO_DIR/$ONCE_REPO_SCENARIOS
  echo ONCE_DIR=$COMPONENTS_DIR/tla/EAM/layer1/Thinglish/Once/latestServer
  echo ONCE_DEFAULT_SCENARIO=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer
  echo ONCE_LOAD_DIR=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer/oosh
  echo PATH=$PATH
}

once.edit()                 # starts vim to edit the once script
{

  once.cmd vim
  vim $ONCE_DIR/src/sh/once.sh
}

once.code()                 # starts vim to edit the Once.class.js Kernel 
{

  once.cmd vim
  vim $ONCE_DIR/src/js/Once.class.sh
}


once.update()               # updates a git pull on the repository to get all the newest versions
                            # updates fromBranch <?origin> updates the current branch from origin: e.g. once update fromBranch origin/test/sprint12
                            # updates cmd <command> updates the command 
{

  #set -x
  local command=$1
  if [ -z "$command" ]; then
    shift
  fi

  local branch=$1
  if [ -z "$branch" ]; then
    shift
  fi
  case $command in
    byIP)
      scp ~/scripts/once.sh root@$ONCE_DEFAULT_SSH_IP:/root
      ;;
    server)
      scp ~/scripts/once.sh root@$ONCE_DEFAULT_HOST:/root
      #scp ~/scripts/once.sh root@$ONCE_DEFAULT_HOST:$COMPONENTS_DIR/tla/EAM/layer1/Thinglish/Once/latestServer/src/sh/once.sh
      #scp ~/scripts/once.sh root@$ONCE_DEFAULT_HOST:$COMPONENTS_DIR/tla/EAM/layer1/Thinglish/Once/4.0.0/src/sh/once.sh
      #scp ~/scripts/once.sh root@$ONCE_DEFAULT_HOST:$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/4.0.0/oosh/once
      ;;
    here)
      #set -x
      shift
      local url=$1
      if [ -z "$url" ]; then
        url=$ONCE_LOCAL_SERVER
      fi
      if [ -z "$url" ]; then
        url=$ONCE_DEFAULT_URL
      fi
      rm ./once.sh
      wget $url/EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once/latestServer/src/sh/once.sh
      chmod +x ./once.sh
      cp ./once.sh $ONCE_REPO_PREFIX/EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once/latestServer/src/sh
      #scp root@$ONCE_DEFAULT_HOST:/root/once.sh ./once.sh
      #pushd $ONCE_REPO_PREFIX/EAMD.ucp/Components/tla/EAM/layer1/Thinglish/Once/latestServer/src/sh
      rm ~/once.sh
      rm ~/once
      exit 0
      ;;
    root)
      scp root@$ONCE_DEFAULT_SSH_IP:/root/once.sh ~/scripts/once.sh
      ;;
    fromBranch)
      once.update.fromBranch $branch 
      set +x
      exit 0
      ;;
    cmd)
      rm $(which $branch)
      once.cmd $branch
      ;;
    *)
      #once.cmd once
      cd $REPO_DIR
      currentBranch=$(git rev-parse --abbrev-ref HEAD)
      if [ "$ONCE_LATEST_BRANCH" = "$currentBranch" ]; then
        console.log "once update by: git pull"
        git pull
      else
        console.log "once update by: git merge origin/$ONCE_LATEST_BRANCH"

        once.update.fromBranch origin/$ONCE_LATEST_BRANCH
      fi
      ;;
  esac
  
  set +x
  RETURN=$@
  once.done
}

function once.update.fromBranch()
{ 
      local branch=$1
      once.cmd git
      shift
      cd $REPO_DIR
      git pull
      git reset HEAD --hard
      #git clean -fdx
      git merge $1
      git push
      once.stage done
} 

function once.done()                 # finalising script execution in a clean process
{
	ONCE_STATE=state
  once.hibernate update
  console.log "once.sh: done $NEW"
  if [ -n "$NEW" ]; then
    cd ~
    scripts/once.sh links.fix
    $ONCE_REPO_PREFIX/$ONCE_REPO_NAME/$ONCE_REPO_COMPONENTS/com/ceruleanCircle/EAM/1_infrastructure/NewUserStuff/scripts/once.sh links.fix
    #clear
    NEW=
    $ONCE_SHELL -c ". ~/.bashrc; once status; $SHELL"
  fi
  exit 0
}

once.env()                  # lists the current $PATH paths on the screen 
{
  once cmd vim
  vim ~/.once
  RETURN=$@
}

once.paths.save()           # saves the current $PATH into the file in $ONCE_DEFAULT_SCENARIO/paths 
{
  cd $ONCE_DEFAULT_SCENARIO
  rm paths
  eamd call loop $PATH : call echo "paths"
}

once.paths.list()           # printing list of paths 
{
  cat $ONCE_DEFAULT_SCENARIO/paths
}

once.paths.edit()           # manually edit paths with vim
{
  vim $ONCE_DEFAULT_SCENARIO/paths
}

once.paths.load()           # loading all paths
{
    if [ ! -f $ONCE_DEFAULT_SCENARIO/paths ]; then
      console.log "$ONCE_DEFAULT_SCENARIO/paths not found!!!"
      once.paths.reset
      once.paths.save
      once.scenario
      return
    fi

    PATH=
    while read line; do
      if [ -n "$PATH" ]; then
        PATH=$PATH:$line
      else
        PATH=$line
      fi
    done <$ONCE_DEFAULT_SCENARIO/paths
    export PATH
    echo $PATH
}


function once.mv()                   # to be deleted: moves the Repo prefix...just a test 
{

  REPO_PREFIX_UNDO=$ONCE_REPO_PREFIX
  if [ -n "$1" ]; then
    ONCE_REPO_PREFIX=$1
  fi
  once.update.variables
  once.config.list
  echo
  echo REPO_PREFIX_UNDO=$REPO_PREFIX_UNDO
}

once.links.fix()            # checks that the once and once.sh are links to the latest files after repo.init
{
  local DIR=$(dirname $This)
  if [ "$DIR" = "." ]; then
    DIR=$startDir
  fi

  if [ "$DIR" = "$ONCE_DIR/src/sh" ]; then
    DIR=/usr/local/sbin
  fi

  if [ "$DIR" = "/usr/local/sbin" ]; then
    console.log "once not yet installed but mapped to /usr/local/sbin  ...  $This ... $(dirname $This)... nothing changed!"
  else
    checkAndFix "make once.sh a live link into the repository $This" -L "$(dirname $This)/once.sh" "links.fix" 
    once.links
  fi

}
function links.fix()        # checks that the once and once.sh are links to the latest files after repo.init
{
  local DIR=$(dirname $This)
  if [ "$DIR" = "$ONCE_DIR/src/sh" ]; then
    err.log "Cannot fix links in $DIR"
    return
  fi
  #rm $DIR/once.sh
  rm $DIR/once*
  rm $DIR/eamd*
  rm /var/dev/EAMD.ucp/Scenarios/localhost/EAM/1_infrastructure/Once/latestServer/oosh/eamd*
  ln -s /var/dev/EAMD.ucp/Components/tla/EAMD/UcpComponentSupport/1.0.0/src/sh/eamd /var/dev/EAMD.ucp/Scenarios/localhost/EAM/1_infrastructure/Once/latestServer/oosh/eamd
  ln -s /var/dev/EAMD.ucp/Components/tla/EAMD/UcpComponentSupport/1.0.0/src/sh/eamd $DIR/eamd
  ln -s $ONCE_DIR/src/sh/once.sh $DIR/once.sh
  pushd .
  cd $DIR
  ln -s ./once.sh once
  popd
}

once.links()                  # lists the most important links
{
    local DIR=~/scripts
    which once
    ls -alF $DIR/once*
    which eamd
    ls -alF $DIR/eamd*
}

function once.links.replace() # replace the once links by a hardcopy of the latest version form the repo
{
  local DIR=$(dirname $This)
  if [ "$DIR" = "." ]; then
    DIR=$startDir
  fi

  if [ "$DIR" = "$ONCE_DIR/src/sh" ]; then
    DIR=/usr/local/sbin
  fi

  if [ "$DIR" = "/usr/local/sbin" ]; then
    console.log "once not yet installed but mapped to /usr/local/sbin  ...  $This ... $(dirname $This) ... nothing changed!"
  else
    rm $DIR/once.sh
    cp $ONCE_DIR/src/sh/once.sh $DIR
    ls -alF $DIR/once*
  fi
}

once.docker(){

    if [ "$1" = "WODA" ] || [ "$1" = "woda" ]; then
      if [ "$2" = "server" ] || [ "$2" = "Server" ]; then
        if [ "$3" = "build" ] || [ "$3" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/
          ./buildDockerFileServer
        elif [ "$3" = "run" ] || [ "$3" = "RUN" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/
          ./runDockerFileServer
        else
          echo "Invalid Docker Command..."
        fi
      elif [ "$2" = "local" ] || [ "$2" = "LOCAL" ]; then
        if [ "$3" = "build" ] || [ "$3" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/
          ./buildDockerFileLocal
        elif [ "$3" = "run" ] || [ "$3" = "RUN" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/
          ./runDockerFileLocal
        else
          echo "Invalid Docker Command..."
        fi
      else
        echo "Invalid Docker Command..."
      fi
    elif [ "$1" = "nodejs" ] || [ "$1" = "Nodejs" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nodejs/14/
          ./buildDocker
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nodejs/14/
          ./runDocker
        else
          echo "Invalid Docker Command..."
        fi
    elif [ "$1" = "structr" ] || [ "$1" = "Structr" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Openjdk/8/Structr/2.1.4/
          ./buildDocker
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Openjdk/8/Structr/2.1.4/
          ./runDocker
        else
          echo "Invalid Docker Command..."
        fi
    elif [ "$1" = "open-ssl" ] || [ "$1" = "Open-SSL" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nginx/1.15/certbot/1.7.0/test.wo-da.de/
          ./buildDocker
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/WODA/1.0.0/Alpine/3.13.2/Nginx/1.15/certbot/1.7.0/test.wo-da.de/
          ./runDocker
        else
          echo "Invalid Docker Command..."
        fi
    elif [ "$1" = "nakedalpine" ] || [ "$1" = "nakedAlpine" ] || [ "$1" = "minimulLinux" ] || [ "$1" = "minimullinux" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedAlpine/3.13.2/
          ./buildDockerfile
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
          if [ "$3" = "eamd" ] || [ "$3" = "EAMD" ]; then
            cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedAlpine/3.13.2/
            ./runDockerWithEAMD
          else
            cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedAlpine/3.13.2/
              ./runDockerfile
          fi
        else
          echo "Invalid Docker Command..."
        fi
    elif [ "$1" = "nakedubuntu" ] || [ "$1" = "nakedUbuntu" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedUbuntu18.4/
          ./buildDockerfile
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
          if [ "$3" = "eamd" ] || [ "$3" = "EAMD" ]; then
            cd cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedUbuntu18.4/
            ./runDockerWithEAMD
          else
            cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedUbuntu18.4/
            ./runDockerfile
          fi
        else
          echo "Invalid Docker Command..."
        fi
    elif [ "$1" = "nakeddebian" ] || [ "$1" = "nakedDebian" ];then
        if [ "$2" = "build" ] || [ "$2" = "BUILD" ]; then
          cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedDebian9.12/
          ./buildDockerfile
        elif [ "$2" = "run" ] || [ "$2" = "RUN" ]; then
            cd /var/dev/EAMD.ucp/Components/com/ceruleanCircle/EAM/1_infrastructure/DockerWorkspaces/nakedDebian9.12/
            ./runDockerfile
        else
          echo "Invalid Docker Command..."
        fi
    else
      echo "No Such Docker Image Found...."
    fi
}

function once.better.docker()
{
    case $1 in
      WODA)
        shift
        once.docker.woda
        "$@"
        ;;
      nodejs)
        shift
        once.docker.nodejs
        "$@"
        ;;
      structr)
        once.docker.structr "$@"
        ;;
      '')
        debug.log "$0: EXIT"
        #exit 0
        return
        ;;
      *)
        console.log "once.stage to: $@"
        once.stage docker.$1 "$@"
    esac
}


function once.docker.install(){
  if [ -z "$USERNAME" ]; then
    export USERNAME="${USER}"
  fi
  if [ ! $USERNAME = "root" ]; then
    echo "Super User Permissin Required..! Re-run it with super user"
    exit 0;
  fi
  if [ -x "$(command -v brew)" ]; then
            brew cask install docker
            brew install docker-compose
        elif [ -x "$(command -v apk)" ]; then
            apk update
            apk add docker
            addgroup $USERNAME docker            
            rc-update add docker boot
            service docker start
            apk add docker-compose
        elif [ -x "$(command -v apt-get)" ]; then
            echo "Installing Docker & Docker Compose..."
            apt-get -y install curl apt-transport-https ca-certificates curl gnupg2 software-properties-common
            curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
            add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"
            apt-get update
            apt-get -y install docker-ce docker-ce-cli containerd.io
            usermod -aG docker $USERNAME
            curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
            chmod +x /usr/local/bin/docker-compose
            docker --version
            docker-compose --version
        elif [ -x "$(command -v pacman)" ]; then
            echo "Installing Docker & Docker Compose..."
            pacman -Syu
            echo "installing Docker......"
            pacman -S --needed docker
            echo "installing Docker Compose......"
            pacman -S --needed docker-compose
            groupadd docker
            gpasswd -a ${USERNAME} docker
        else
            message "FAILED TO INSTALL PACKAGE: Package manager not found. You must manually install: $1";
        fi
}





once.init()                 # forces reinitialisation
{
  export PS4='+${LINENO}: '
  clear
  unset NEW
  once.version
  console.log "initialize Once"


  #wo-da.de IP for once.update
  ONCE_DEFAULT_SSH_IP=178.254.36.232
  
  #for once.load
  #ONCE_LOCAL_SERVER=http://192.168.178.49:8080
  
  ONCE_DEFAULT_SERVER=test.wo-da.de
  ONCE_SHELL=$SHELL
  #ONCE_USERHOME=$(cd;pwd)

  ONCE_REPO_NAME=EAMD.ucp
  ONCE_REPO_COMPONENTS=Components
  ONCE_REPO_SCENARIOS=Scenarios
  
  if [ -z "$ONCE_INITIAL_PATH" ]; then
    console.log "saving inital PATH"
    ONCE_INITIAL_PATH=$PATH
  fi

  ONCE_LATEST_BRANCH=test/sprint21
  ONCE_SCENARIO_BRANCH=test/main

  ONCE_REVERSE_PROXY_CONFIG='[["auth","test.wo-da.de"],["snet","test.wo-da.de"],["structr","test.wo-da.de"]]'
  ONCE_REV_PROXY_HOST=127.0.0.1
  ONCE_REV_PROXY_PORT=5002
  ONCE_PROXY_HOST=127.0.0.1
  ONCE_PROXY_PORT=5001


  #stepDebugger ON
  #once.check.privileges
  
  if [ -n "$1" ]; then
    ONCE_REPO_PREFIX=$1
    console.log "custom.installation: at $ONCE_REPO_PREFIX"
    ONCE_STATE=user.installation
  fi
 
  once.check.privileges

  #once.stage
}

function once.update.variables()     # updates the environmental variables: REPO_DIR, COMPONENTS_DIR, SCENARIOS_DIR, ONCE_DIR, ONCE_DEFAULT_SCENARIO, ONCE_LOAD_DIR
{
  console.log "update Variables:"

  export REPO_DIR=$ONCE_REPO_PREFIX/$ONCE_REPO_NAME
  export COMPONENTS_DIR=$REPO_DIR/$ONCE_REPO_COMPONENTS
  export SCENARIOS_DIR=$REPO_DIR/$ONCE_REPO_SCENARIOS
  ONCE_DIR=$COMPONENTS_DIR/tla/EAM/layer1/Thinglish/Once/latestServer
  
  if [ ! -d "$ONCE_DEFAULT_SCENARIO" ]; then 
    console.log "no default scenario, using localhost"
    ONCE_DEFAULT_SCENARIO=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer
  fi
  
  ONCE_LOAD_DIR=$SCENARIOS_DIR/localhost/EAM/1_infrastructure/Once/latestServer/oosh

  if [ -z "$ONCE_STRUCTR_SERVER" ]; then 
    console.log "no default ONCE_STRUCTR_SERVER"
    ONCE_STRUCTR_SERVER=https://$ONCE_DEFAULT_SERVER:$ONCE_REV_PROXY_PORT
    console.log "  setting: $ONCE_STRUCTR_SERVER"
  fi

  if [ -z "$ONCE_DEFAULT_SERVER" ] ; then
    ONCE_DEFAULT_SERVER=$ONCE_DEFAULT_HOST
    warn.log "ONCE_DEFAULT_SERVER is deprecated: please use ONCE_DEFAULT_HOST or ONCE_DEFAULT_URL instead"
  fi

  if [ -z "$ONCE_DEFAULT_HOST" ] ; then
    ONCE_DEFAULT_HOST=$ONCE_DEFAULT_SERVER
    warn.log "ONCE_DEFAULT_SERVER is deprecated: pleas usee ONCE_DEFAULT_HOST or ONCE_DEFAULT_URL instead"
  fi
  
  if [ -z "$ONCE_DEFAULT_URL" ] ; then
    ONCE_DEFAULT_URL=https://$ONCE_DEFAULT_HOST
  fi
  
  if [ -z "$ONCE_POSTGRES_CONNECTION_STRING" ] ; then
    ONCE_POSTGRES_CONNECTION_STRING=postgresql://once:qazwsx123@localhost:5433/oncestore
  fi

  if [ -z "$ONCE_DIRECT_HTTPS_URL" ] ; then
    ONCE_DIRECT_HTTPS_URL=https://$ONCE_DEFAULT_HOST:8443
  fi

  if [ -z "$ONCE_DEFAULT_UDE_STORE" ] ; then
    ONCE_DEFAULT_UDE_STORE=https://localhost:8443
  fi

  export ONCE_DIR

  set | grep ^ONCE_EXPORT_ | sed 's/^\(ONCE_EXPORT_\)\(.*\)/export \2/' >./tmp.once.export.env
  cat ./tmp.once.export.env
  source ./tmp.once.export.env
  rm ./tmp.once.export.env
}

function once.stage()                # transitions to the next state of th ONCE STATE MACHINE and saves it for recovery
{
  debug.log "once.stage: -$1- COMMANDS=-$COMMANDS- RETURN=-$RETURN- @=-$@-"
  
  if [ -n "$1" ]; then
	  ONCE_STATE=$1
    once.hibernate update
  fi
  if [ "$ONCE_STATE" = "stage" ] ; then
	  ONCE_STATE=status
    once.stage
    return
  fi
  if [ -z "$ONCE_STATE" ] ; then
	  ONCE_STATE=discover
  fi
  test -t 1 && tput bold; tput setf 6                                    ## white yellow
  echo "Once transition to: $ONCE_STATE $@"
  test -t 1 && tput sgr0 # Reset terminal
  shift
  
  #if [ "ON" = "$DEBUG" ]; then 
  #  stepDebugger ON
  #fi

  once.$ONCE_STATE "$@"
  if [ "$?" = "0" ]; then
    return $?
  else
    err.log "$?"
    once.stage done
  fi
}

function once.sh() {
  warn.log "entering once shell level $(($SHLVL/2+1))"  #whitespace is totally important
  bash
  warn.log "back to once shell level $(($SHLVL/2))"
  if [ $SHLVL == 2 ]; then
      console.log "bottom reached .... do not exit the shell again"
  fi
}

function once.sh.exit()                           # exits until at shell level 1 
{
    if [ $SHLVL == 2 ]; then
      warn.log "back to once shell level $SHLVL"
      console.log "bottom reached .... not exiting shell"
      return      
    else
      warn.log "back to once shell level $SHLVL"
      exit
    fi
}

function once.hibernate()            # save environmental variables and puts once in hibernation 
{

  #writes all ONCE_ env variables to .once in the users home directroy
  if [ -n "$ONCE_SCENARIO" ]; then
    ONCE_DEFAULT_SCENARIO=$ONCE_SCENARIO
  fi

	#set | grep ^ONCE_ >$ONCE_DEFAULT_SCENARIO/.once
  set | grep ^ONCE_ | sed 's/^\(ONCE_\)\(.*\)/export \1\2/' >$ONCE_DEFAULT_SCENARIO/.once
  echo export ONCE_DEFAULT_SCENARIO=$ONCE_DEFAULT_SCENARIO >~/.once
  echo . $ONCE_DEFAULT_SCENARIO/.once >>~/.once
  echo PATH=$PATH >>~/.once
  
  if [ -z "$1" ]; then
    console.log "hibernating once.sh"
    exit 0
  fi
}

once.mode()                 # sets the mode to either LOCAL or DOCKER and defines if "once start" tries to use local npm oder npm in a docker container
{
    if [ -z "$ONCE_MODE" ]; then 
      ONCE_MODE=LOCAL
    fi

    if [ -z "$1" ]; then 
        console.log "ONCE MODE: $ONCE_MODE"
        once.stage done
        return
    fi
    once.server.stop
    console.log "set ONCE MODE to: $1"
    ONCE_MODE=$1
    shift
    RETURN=$@
    once.stage done
}

once.restart()
{
  once.server.stop
  once.server.start fast
}

once.test()
{
  once.server.stop
  cd $ONCE_DIR
  npm install
  npm test
}

once.start()                # starts the Once Server in the background and remembers its PID; that is if no ohter instance of once is running (the forceful start of another once server is on a dynamic port counting upward from 8080)
{
  COMMANDS="$@"
  once.discover
  if [ -z "$1" ]; then 
        console.log "no parameters! stage to: $ONCE_STATE"
        once.stage
        console.log "$this: Bye"
        
        once.done
  fi

  while [ -n $1 ]; do
    debug.log "start 1: -$1-"
    case $1 in
      call)
        shift
        "$@"
        ;;
      discover)
        once.discover
        if [ "$ONCE_STATE" = "disvocer" ]; then
          ONCE_STATE=check.installation
          once.stage
        fi
        ;;
      start)
        once.server.start "$@"
        ;;
      '')
        debug.log "$0: EXIT"
        #exit 0
        return
        ;;
      *)
        console.log "once.stage to: $@"
        once.stage "$@"
    esac

    while [ ! "$RETURN" = "$1" ]; do
      shift
      debug.log "shift:  -Return:$RETURN-  -$1- -command=$COMMANDS-  =$@="
      if [ -z "$1" ]; then
        debug.log "force stop"
        RETURN=
        exit 0
      fi
    done
    debug.log "found"
    
  done
  debug.log "will stage"
  once.stage $ONCE_STATE
}






once.start "$@"
