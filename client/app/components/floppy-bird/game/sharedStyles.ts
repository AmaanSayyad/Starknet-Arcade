export const sharedButtonStyle = {
  position: 'absolute',
  right: '10px',
  padding: '6px 8px',
  fontSize: '8px',
  color: 'white',
  border: '2px solid #34495e',
  borderRadius: '4px',
  cursor: 'pointer',
  zIndex: 3000,
  fontFamily: "'Press Start 2P', cursive",
  textShadow: '1px 1px 0px rgba(0,0,0,0.5)',
  transition: 'all 0.2s ease',
  boxShadow: '2px 2px 0 #34495e',
  ':hover': {
    transform: 'translate(1px, 1px)',
    boxShadow: '1px 1px 0 #34495e'
  },
  ':active': {
    transform: 'translate(2px, 2px)',
    boxShadow: 'none'
  }
};

export const sharedOverlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000
};

export const sharedPopupStyle = {
  backgroundColor: '#4ec0ca',
  border: '4px solid #2c3e50',
  borderRadius: 0,
  padding: '20px',
  width: '90%',
  maxWidth: '400px',
  maxHeight: '80vh',
  overflowY: 'auto',
  position: 'relative',
  animation: 'popupFadeIn 0.3s ease',
  boxShadow: '4px 4px 0 #2c3e50',
  fontFamily: "'Press Start 2P', cursive"
}; 