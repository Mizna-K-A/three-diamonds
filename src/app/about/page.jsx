import AboutPage from "../components/AboutPage";
import HeaderWithPropertyTypes from "../components/HeaderWithPropertyTypes";

export const metadata = {
  title: 'About Us - Three Diamonds Real Estate',
  description: 'Learn about Three Diamonds Real Estate, our mission, vision, leadership team, and our journey in transforming Dubai\'s real estate landscape since 2021.',
};

export default function About() {
  return (
 <>
  <HeaderWithPropertyTypes/>
  <AboutPage />
 </>
  );
}