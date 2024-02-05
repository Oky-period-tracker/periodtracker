# Database droplet

Go to Digital Ocean and create a droplet

When selecting the region for the droplet, bear in mind that this region is where data will be stored, so there may be legal implications. For example, if you are in the EU, you may want to select a region in the EU. Also the closer the region the better the performance.

The following options are suggested as a minimum for getting started, you may need to increase these depending on your needs.

```
Ubuntu

Droplet type: Basic

CPU:
Regular, Disk type: SSD

2 GB / 1 CPU
50 GB SSD Disk
2 TB transfer
```

For authentication, I recommend setting up SSH keys because this is more secure than using a password.

`Add improved metrics monitoring and alerting (free)` - since this option is free it is recommended to select it.

`Enable backups` - this is recommended if you are intending to use this droplet for production.

Give your droplet a name for example `periodtracker-database-droplet`

---

## Set up the droplet

Connect to your Droplet:

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

Create a user for your database

```sql
CREATE USER periodtracker WITH PASSWORD 'periodtracker';
```

If successful you should see:`CREATE ROLE`

Next create a database

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

From another terminal window that isn't connected to the droplet, get the IP of your nodes

```bash
kubectl get nodes -o wide
```

If you have multiple nodes they should have similar EXTERNAL IPS, for example `123.45.67.000`, where only the last set of numbers vary

Copy paste the EXTERNAL IP, of any of your nodes, it doesn't matter which

Return to the droplet terminal

Allow access to the droplet from this IP address

The `/24` after the IP address means that the last 3 digits of the IP are allowed to vary, this allows all of your nodes to connect to the droplet, because each of your nodes IP addresses will vary in the last few numbers. If you have automatic scaling enabled for your cluster, your cluster may dynamically create new nodes with new IP addresses.

> Please note that it is possible that your nodes change IP address in future, more than just the last 3 numbers, in which case you will need to update the droplet firewall and the pg_hba.conf file with the new IP address

```bash
sudo ufw allow from YOUR_NODE_IP/24 to any port 5432

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

If you check the status again, you should see a list showing that the droplet is accessible via OpenSSH and port 5432 via your cluster IP address.

---

## Changing postgres config files

In order to allow access to the postgres server we need to change 2 config files, these files will be located in /etc/postgresql/<VERSION_NUMBER>/main/

First, change directory, this will vary depending on the version of postgres you have installed, for example, if you have version 14 installed, you would run:

```bash
cd /etc/postgresql/14/main
```

> If you are not sure which version you have installed, go to `/etc/postgresql` and run `ls` to see what folders exist inside

Open the pg_hba.conf file

```bash
sudo nano pg_hba.conf
```

Scroll down to find this section

```conf
# Put your actual configuration here

# ----------------------------------

#

# If you want to allow non-local connections, you need to add more

# "host" records. In that case you will also need to make PostgreSQL

# listen on a non-local interface via the listen_addresses

# configuration parameter, or via the -i or -h command line switches.
```

Enter the following below this section

```conf
host    db_name  db_user_name       YOUR_NODE_IP/24       md5
```

As mentioned previously, the `/24` allows the last 3 digits of you IP to vary, to allow access to all of your nodes

> Please note that it is possible that your nodes change IP address in future, more than just the last 3 numbers, in which case you will need to update the droplet firewall and the pg_hba.conf file with the new IP address

Use `control x` to exit, then `y` to save and `enter` to confirm the file name.

Open the other config file:

```bash
sudo nano postgresql.conf
```

Look for this section:

```conf
#------------------------------------------------------------------------------

# CONNECTIONS AND AUTHENTICATION

#------------------------------------------------------------------------------

# - Connection Settings -

#listen_addresses = 'localhost' # what IP address(es) to listen on;
```

Underneath this line, add the following:
(replace droplet_ip_address with the actual IP address of your droplet)

`listen_addresses = 'localhost,droplet_ip_address'`

As before, use `control x` to exit, then `y` to save and `enter` to confirm the file name.

Restart the postgres daemon for the file changes to take effect:

```bash
sudo systemctl restart postgresql
```

Check that the postgres server is active:

```bash
sudo systemctl status postgresql
```
