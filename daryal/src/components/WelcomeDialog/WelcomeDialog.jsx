"use client"

function WelcomeDialog({ onStart, onOBDClick }) {
  return (
    <div className="welcome-dialog">
      <div className="welcome-options-container">
        <div className="button-content">
          <button onClick={onStart} className="start-btn">
          Manual
          </button>
        </div>
        <div className="quick-access">
          <div className="quick-buttons">
            <button className="start-btn" onClick={onOBDClick}>
              OBD-II
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeDialog
