<?php
class dbObj
{
    var $servername = "localhost";
    var $username = "sebamp_ampon_db";
    var $password = "shouakihiro";
    var $dbname = "sebamp_ampon_db";
    var $conn;

    public function getConnstring()
    {
        $this->conn = mysqli_connect($this->servername, $this->username, $this->password, $this->dbname);
        if (!$this->conn) {
            die("Connection Failed: " . mysqli_connect_error());
        } else {
            return $this->conn;
        }
    }
}
?>