import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

const InvestmentPage = () => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);  

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('/api/assets'); 
        setAssets(response.data);  
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchAssets();
  }, []);

  const handleInvestment = async () => {
    if (!selectedAsset) {
      alert('Please select an asset to invest in.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/investments/invest', {
        userId: 1,  
        assetId: selectedAsset.id,
        amount: investmentAmount,
      });

      console.log('Investment Successful:', response.data);
      setShowModal(true); 
    } catch (error) {
      alert('Investment failed: ' + error.message);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <div>
      <h1>Invest in an Asset</h1>

      {/* Dropdown to select an asset */}
      <select onChange={(e) => setSelectedAsset(assets.find(asset => asset.id === parseInt(e.target.value)))}>
        <option value="">Select an Asset</option>
        {assets.map(asset => (
          <option key={asset.id} value={asset.id}>
            {asset.asset_name} {/* Adjust this depending on the actual structure of your asset data */}
          </option>
        ))}
      </select>

      {/* Investment amount input */}
      <input
        type="number"
        value={investmentAmount}
        onChange={(e) => setInvestmentAmount(e.target.value)}
        placeholder="Amount to invest"
      />

      {/* Submit button */}
      <button onClick={handleInvestment} disabled={loading}>
        {loading ? 'Processing...' : 'Invest'}
      </button>

      {/* Success modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Investment Successful</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You have successfully invested ${investmentAmount} in {selectedAsset ? selectedAsset.asset_name : ''}.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default InvestmentPage;


