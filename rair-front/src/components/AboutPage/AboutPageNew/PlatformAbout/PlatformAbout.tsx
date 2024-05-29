import * as React from 'react';
import { AccordionProps, AccordionSummaryProps } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
// import Typography from '@mui/material/Typography';

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&:before': {
    display: 'none'
  }
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    // expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(() => ({
  backgroundColor: '#383637',
  borderRadius: 16,
  color: 'white',
  textAlign: 'center',
  // flexDirection: 'row-reverse',
  display: 'flex',
  justifyContent: 'center',
  alignContent: 'center'
}));

const PlatformAbout = () => {
  const [expanded, setExpanded] = React.useState<boolean | string>(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className="about-page-platform">
      <div className="about-page-platform-title">Platform</div>
      <div className="about-page-platform-content">
        <div className="platform-box">
          <div className="platform-title-box">
            <div className="platform-title">Tools</div>
          </div>
          <div className="categories-list">
            <ul>
              <li>Drop page</li>
              <li>Marketplace</li>
              <li>Streaming</li>
              <li>Backend</li>
            </ul>
          </div>
        </div>
        <div className="platform-box">
          <div className="platform-title-box">
            <div className="platform-title">Minting</div>
          </div>
          <div className="categories-list">
            <ul>
              <li>Ethereum</li>
              <li>MATIC</li>
              {/* <li>Binance Smart Chain</li> */}
              <li>EIP2535 Diamonds</li>
            </ul>
          </div>
        </div>
        <div className="platform-box">
          <div className="platform-title-box">
            <div className="platform-title">Royalties</div>
          </div>
          <div className="categories-list">
            <ul>
              <li>On Chain</li>
              <li>Lock to Contract</li>
              <li>Custom Splits</li>
              <li>EIP2981 Universal</li>
            </ul>
          </div>
        </div>
        <div className="platform-box">
          <div className="platform-title-box">
            <div className="platform-title">Metadata</div>
          </div>
          <div className="categories-list">
            <ul>
              <li>Bulk Creation</li>
              <li>Generative Art</li>
              <li>IPFS + Cloud</li>
              <li>Aggregate to Opensea etc.</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="about-platform-content-mobile">
        <Accordion
          expanded={expanded === 'panel1'}
          onChange={handleChange('panel1')}>
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header">
            <p>Deployment</p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="categories-list">
              <ul>
                <li>Metaverse</li>
                <li>Marketplace</li>
                <li>Creation Tools</li>
                <li>Backend</li>
              </ul>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel2'}
          onChange={handleChange('panel2')}>
          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header">
            <p>EVM Support</p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="categories-list">
              <ul>
                <li>Ethereum</li>
                <li>MATIC</li>
                {/* <li>Binance Smart Chain</li> */}
                <li>EIP2535 Diamonds</li>
              </ul>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel3'}
          onChange={handleChange('panel3')}>
          <AccordionSummary aria-controls="panel3d-content" id="panel3d-header">
            <p>Royalties</p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="categories-list">
              <ul>
                <li>On Chain</li>
                <li>Lock to Contract</li>
                <li>Custom Splits</li>
                <li>EIP2981 Universal</li>
              </ul>
            </div>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleChange('panel4')}>
          <AccordionSummary aria-controls="panel4d-content" id="panel4d-header">
            <p>Metadata</p>
          </AccordionSummary>
          <AccordionDetails>
            <div className="categories-list">
              <ul>
                <li>Bulk Creation</li>
                <li>Generative Art</li>
                <li>IPFS + Cloud</li>
                <li>Aggregate to Opensea et al</li>
              </ul>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
    </div>
  );
};

export default PlatformAbout;
