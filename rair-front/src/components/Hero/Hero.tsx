import { useAppSelector } from '../../hooks/useReduxHooks';
import OvalButton from '../OvalButton/OvalButton';
import './Hero.css';
import ExternalLinkGradient from '../../images/ExternalLinkGradient';

export default function Hero () {
  const {
    primaryColor,
    secondaryColor,
    textColor,
    secondaryTextColor
    
  } = useAppSelector((store) => store.colors);
  return (
    <div className='hero'>
      <h1 style={{ color: secondaryTextColor }}><span className='border-only'><span aria-hidden={true} className='over'>onchain</span>onchain</span> wellness<br/>for <span className='border-only'><span aria-hidden={true} className='over'>a</span>a</span> <span className='border-only'><span aria-hidden={true} className='over'>better</span>better</span> future</h1>
      <OvalButton
        onclick={() => alert('hello')}
        backgroundColor={secondaryColor}
        textColor={secondaryTextColor}
      >Get Started</OvalButton>

      <section className='description'>
        <div className='description-header'>
          <h2 style={{ color: secondaryTextColor }}>Decentralized Wellness</h2>
          <p> Empowering individuals with secure, private, and personalized mental health support. Our platform offers 1:1 individual therapy with licensed professionals, expert-led workshops on topics like resilience and trauma healing, and AI-powered therapy through THERA Agents, your customizable digital wellness companion. Designed for the modern, decentralized world, we provide accessible care tailored to your unique journey.</p>
        </div>

        <div
          className='description-features'
        >
            <article>
                <h4><ExternalLinkGradient /> 1:1 Individual Therapy</h4>
                <p>Personalized, confidential support with licensed professionals to address your unique needs.</p>
            </article>
            <article>
                <h4><ExternalLinkGradient /> AI Assisted Therapy</h4>
                <p>Introducing our THERA Agents, your customizable digital therapist offering on-demand, private mental health support.</p>
            </article>
            <article>
                <h4><ExternalLinkGradient /> Workshops</h4>
                <p>Expert-led sessions focused on resilience, healing, and growth in a collaborative environment.</p>
              </article>

        </div>
      </section>
      
    </div>
  );
};