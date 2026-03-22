export const  BELZ_ABI = [
  // ── View ──
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function owner() view returns (address)",
  "function balanceOf(address) view returns (uint256)",
  "function allowance(address, address) view returns (uint256)",

  // ── Faucet ──
  "function MAX_SUPPLY() view returns (uint256)",
  "function REQUEST_AMOUNT() view returns (uint256)",
  "function REQUEST_INTERVAL() view returns (uint256)",
  "function canRequest(address _user) view returns (bool)",
  "function timeUntilNextRequest(address _user) view returns (uint256)",
  "function lastRequestTime(address) view returns (uint256)",

  // ── Write ──
  "function requestToken()",
  "function transfer(address _to, uint256 _amount) returns (bool)",
  "function transferFrom(address _from, address _to, uint256 _amount) returns (bool)",
  "function approve(address _spender, uint256 _amount) returns (bool)",
  "function burn(uint256 _amount)",

  // ── Owner ──
  "function mint(address _to, uint256 _amount)",
  "function transferOwnership(address _newOwner)",

  // ── Events ──
  "event TokensRequested(address indexed _user, uint256 _amount, uint256 _time)",
  "event Transfer(address indexed _from, address indexed _to, uint256 value)",
  "event Approval(address indexed owner, address indexed spender, uint256 value)",
  "event Mint(address indexed _to, uint256 _amount)",
] as const;