pragma solidity >=0.4.22 <0.9.0;

contract Upload{
    struct Access{
        address user;
        bool access;
    }
    mapping(address=>string[]) value;//toStoreURL
    mapping(address=>mapping(address=>bool)) ownership;
    mapping(address=>Access[])public accessList; //toGIveOwnership
    mapping(address=>mapping(address=>bool)) previousData;
    function add(address _user,string calldata url) external{
        value[_user].push(url);
    }
    function allow(address user) external{
        ownership[msg.sender][user]=true;
        if(previousData[msg.sender][user]==true){
            for(uint i=0;i<accessList[msg.sender].length;i++){
                if(accessList[msg.sender][i].user==user){
                    accessList[msg.sender][i].access=true;
                }
            }
        }else{
        accessList[msg.sender].push(Access(user,true));
        previousData[msg.sender][user]=true;
        }
    }
    function disallow(address user) external{
        ownership[msg.sender][user]=false;
        for(uint i=0;i<accessList[msg.sender].length;i++){
            if(accessList[msg.sender][i].user==user){
        accessList[msg.sender][i].access=false;
    }
    }
    }
    function display(address _user) external view returns(string[] memory){
      require(_user==msg.sender || ownership[msg.sender][_user],"You don't have access");
      return value[msg.sender];
  }
    function shareAccess() public view returns(Access[] memory){
        return accessList[msg.sender];
    }
}