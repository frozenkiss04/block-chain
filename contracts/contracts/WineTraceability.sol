// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title WineTraceability
 * @dev Smart Contract cho hệ thống truy xuất rượu vang cao cấp
 * Lưu IPFS CID lên blockchain
 */
contract WineTraceability {
    // Struct cho thông tin vườn nho
    struct Vineyard {
        uint256 id;
        string name;
        string owner;
        string grapeVariety;
        string latitude;
        string longitude;
        uint256 timestamp;
        bool exists;
    }

    // Struct cho quy trình ủ rượu
    struct FermentationProcess {
        uint256 id;
        uint256 vineyardId;
        string title;
        string description;
        string fileName;
        string fileType;
        string ipfsCid;
        uint256 timestamp;
        address createdBy;
        bool exists;
    }

    // Mappings
    mapping(uint256 => Vineyard) public vineyards;
    mapping(uint256 => FermentationProcess) public processes;
    mapping(uint256 => uint256[]) public vineyardProcesses;

    // Counters
    uint256 public vineyardCount;
    uint256 public processCount;

    // Owner
    address public owner;

    // Events
    event VineyardRegistered(
        uint256 indexed vineyardId,
        string name,
        string owner,
        uint256 timestamp
    );

    event ProcessAdded(
        uint256 indexed processId,
        uint256 indexed vineyardId,
        string title,
        string description,
        string fileName,
        string fileType,
        string ipfsCid,
        address indexed createdBy,
        uint256 timestamp
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier vineyardExists(uint256 _vineyardId) {
        require(vineyards[_vineyardId].exists, "Vineyard does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
        vineyardCount = 0;
        processCount = 0;
    }

    /**
     * @dev Đăng ký vườn nho mới
     */
    function registerVineyard(
        uint256 _id,
        string memory _name,
        string memory _owner,
        string memory _grapeVariety,
        string memory _latitude,
        string memory _longitude
    ) public returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(bytes(_owner).length > 0, "Owner cannot be empty");
        require(!vineyards[_id].exists, "Vineyard ID already exists");

        vineyards[_id] = Vineyard({
            id: _id,
            name: _name,
            owner: _owner,
            grapeVariety: _grapeVariety,
            latitude: _latitude,
            longitude: _longitude,
            timestamp: block.timestamp,
            exists: true
        });

        vineyardCount++;

        emit VineyardRegistered(_id, _name, _owner, block.timestamp);

        return _id;
    }

    /**
     * @dev Thêm quy trình ủ rượu mới với IPFS CID
     */
    function addProcess(
        uint256 _id,
        uint256 _vineyardId,
        string memory _title,
        string memory _description,
        string memory _fileName,
        string memory _fileType,
        string memory _ipfsCid
    ) public vineyardExists(_vineyardId) returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(bytes(_ipfsCid).length > 0, "IPFS CID cannot be empty");
        require(!processes[_id].exists, "Process ID already exists");

        processes[_id] = FermentationProcess({
            id: _id,
            vineyardId: _vineyardId,
            title: _title,
            description: _description,
            fileName: _fileName,
            fileType: _fileType,
            ipfsCid: _ipfsCid,
            timestamp: block.timestamp,
            createdBy: msg.sender,
            exists: true
        });

        vineyardProcesses[_vineyardId].push(_id);
        processCount++;

        emit ProcessAdded(
            _id,
            _vineyardId,
            _title,
            _description,
            _fileName,
            _fileType,
            _ipfsCid,
            msg.sender,
            block.timestamp
        );

        return _id;
    }

    /**
     * @dev Lấy thông tin process
     */
    function getProcess(uint256 _processId) 
        public 
        view 
        returns (
            uint256 id,
            uint256 vineyardId,
            string memory title,
            string memory description,
            string memory fileName,
            string memory fileType,
            string memory ipfsCid,
            uint256 timestamp,
            address createdBy
        ) 
    {
        require(processes[_processId].exists, "Process does not exist");
        
        FermentationProcess memory p = processes[_processId];
        return (
            p.id,
            p.vineyardId,
            p.title,
            p.description,
            p.fileName,
            p.fileType,
            p.ipfsCid,
            p.timestamp,
            p.createdBy
        );
    }

    /**
     * @dev Lấy IPFS CID của process
     */
    function getProcessIPFSCid(uint256 _processId) 
        public 
        view 
        returns (string memory) 
    {
        require(processes[_processId].exists, "Process does not exist");
        return processes[_processId].ipfsCid;
    }

    /**
     * @dev Lấy danh sách process IDs của vineyard
     */
    function getVineyardProcesses(uint256 _vineyardId) 
        public 
        view 
        vineyardExists(_vineyardId)
        returns (uint256[] memory) 
    {
        return vineyardProcesses[_vineyardId];
    }

    /**
     * @dev Lấy thông tin vineyard
     */
    function getVineyard(uint256 _vineyardId)
        public
        view
        returns (
            uint256 id,
            string memory name,
            string memory vineyardOwner,
            string memory grapeVariety,
            string memory latitude,
            string memory longitude,
            uint256 timestamp
        )
    {
        require(vineyards[_vineyardId].exists, "Vineyard does not exist");
        
        Vineyard memory v = vineyards[_vineyardId];
        return (
            v.id,
            v.name,
            v.owner,
            v.grapeVariety,
            v.latitude,
            v.longitude,
            v.timestamp
        );
    }

    /**
     * @dev Kiểm tra process có tồn tại không
     */
    function processExists(uint256 _processId) public view returns (bool) {
        return processes[_processId].exists;
    }

    /**
     * @dev Kiểm tra vineyard có tồn tại không
     */
    function vineyardExistsCheck(uint256 _vineyardId) public view returns (bool) {
        return vineyards[_vineyardId].exists;
    }

    /**
     * @dev Verify IPFS CID
     */
    function verifyIPFSCid(uint256 _processId, string memory _expectedCid) 
        public 
        view 
        returns (bool) 
    {
        require(processes[_processId].exists, "Process does not exist");
        return keccak256(bytes(processes[_processId].ipfsCid)) == keccak256(bytes(_expectedCid));
    }
}
