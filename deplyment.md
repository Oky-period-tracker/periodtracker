# Deployment

1. Create a digital ocean Account

In order to create an account you will need to provide a payment method. You can use a credit card or paypal. You will not be charged until you create a droplet.

2. Create a Project

3. Create a Kubernetes cluster

4. Create a Droplet

This droplet is for the database.

When selecting the region for the droplet, bear in mind that this region is where data will be stored, so there may be legal implications. For example, if you are in the EU, you may want to select a region in the EU. Also the closer the region the better the performance.

Chose Ubuntu

The following options are suggested as a minimum for getting started, you may need to increase these depending on your needs.

Droplet type: Basic

CPU:
Regular, Disk type: SSD

2 GB / 1 CPU
50 GB SSD Disk
2 TB transfer

For authentication, I recommend setting up SSH keys because this is more secure than using a password.

`Add improved metrics monitoring and alerting (free)` - since this option is free it is recommended to select it.

`Enable backups` - this is highly recommended if you are intending to use this droplet for production.

Hostname
Give your droplet a name so that to avoid confusion in future, for example `periodtracker-database-droplet`

Connect to your Droplet:
via your terminal:

```bash
ssh root@your_droplet_ip
```

Replace "your_droplet_ip" with the actual IP address of your droplet.

Update the system to the latest available versions:

```bash
sudo apt update
sudo apt upgrade
```

Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib
```

You may get a message saying that you should restart the server, if so run the following command:

```bash
sudo reboot
```

This will disconnect you from the droplet, wait for it to reboot then reconnect using the same command as before.

Switch to the PostgreSQL user

```bash
sudo -i -u postgres
```

Access the PostgreSQL prompt

```bash
psql
```

```sql
CREATE USER periodtracker WITH PASSWORD 'periodtracker';
```

if successful you should see:`CREATE ROLE`

```sql
CREATE DATABASE periodtracker OWNER periodtracker;
```

If successful you should see: `CREATE DATABASE`

You can now exit the PostgreSQL prompt

```bash
\q
```

and then exit the postgres user

```bash
exit
```

Find your IP address by running this command

```bash
curl ifconfig.me
```

Allow access to the PostgreSQL server from your IP address

```bash
sudo ufw allow from your_IP_address to any port 5432
```

Allow connections to the droplet via SSH

```bash
sudo ufw allow OpenSSH
```

Check the firewall status

```bash
sudo ufw status
```

If it is inactive, enable it

> Make sure you have allowed access to the droplet via SSH before enabling the firewall, otherwise you will be locked out of the droplet. If that happens you will need to destroy the droplet and create a new one.

```bash
sudo ufw enable
```

If you check the status again, you should see a list showing that the droplet is accessible via OpenSSH and port 5432 via your IP address.

Changing postgres config files

In order to allow access to the postgres server we need to change some of the postgres config files, the 2 files we will change are postgresql.conf and pg_hba.conf, these files will be located in /etc/postgresql/9.5/main/

First, change directory, this will vary depending on the version of postgres you have installed, for example, if you have version 14 installed, you would run:

```bash
cd /etc/postgresql/14/main
```

If you are not sure which version you have installed, go to `/etc/postgresql` and run `ls`

Open the postgresql.conf file

```bash
sudo nano pg_hba.conf
```

Scroll down to find this section

`

# Put your actual configuration here

# ----------------------------------

#

# If you want to allow non-local connections, you need to add more

# "host" records. In that case you will also need to make PostgreSQL

# listen on a non-local interface via the listen_addresses

# configuration parameter, or via the -i or -h command line switches.

`

Enter the following below this section

```conf
host    db_name  db_user_name       your_IP_address/32       md5
```

Use `control x` to exit, then `y` to save and `enter` to confirm the file name.

Open the other config file:

```bash
sudo nano postgresql.conf
```

Look for this section:
`
#------------------------------------------------------------------------------

# CONNECTIONS AND AUTHENTICATION

#------------------------------------------------------------------------------

# - Connection Settings -

#listen_addresses = 'localhost' # what IP address(es) to listen on;
`

Underneath this line, add the following:
(replace droplet_ip_address with the actual IP address of your droplet)

`listen_addresses = 'localhost,droplet_ip_address'`

As before, use `control x` to exit, then `y` to save and `enter` to confirm the file name.

Restart the postgres Daemon for the file changes to take effect:

```bash
sudo systemctl restart postgresql
```

Check that the postgres server is active:

```bash
sudo systemctl status postgresql
```

## Create a droplet

## Create a cluster

## Create a k8s submodule
