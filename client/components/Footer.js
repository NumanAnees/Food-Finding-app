import { Layout, Row, Col, Typography, Divider } from "antd";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";

const { Footer } = Layout;
const { Link, Text, Title } = Typography;

const AppFooter = () => {
  return (
    <Footer
      style={{
        backgroundColor: "#04e9ae8f",
        padding: "45px",
        color: "#fff",
        boxShadow: "0px -5px 10px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Row gutter={[24, 24]}>
        <Col span={6}>
          <Title
            level={3}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "24px" }}
          >
            TopDish
          </Title>
          <Text style={{ color: "#fff", fontSize: "16px" }}>
            Discover and share delicious dishes from around the world. Join our
            community of food enthusiasts!
          </Text>
        </Col>
        <Col span={3}>
          <Title
            level={4}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
          >
            About Us
          </Title>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                How it works
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Investors
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={3}>
          <Title
            level={4}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
          >
            Terms of Service
          </Title>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Privacy Policy
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={3}>
          <Title
            level={4}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
          >
            Contact Us
          </Title>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Support
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Destination
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Sponsorship
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={3}>
          <Title
            level={4}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
          >
            Videos
          </Title>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Submit Video
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Ambassadors
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Agency
              </Link>
            </li>
            <li>
              <Link href="#" style={{ color: "#fff", fontSize: "16px" }}>
                Influencer
              </Link>
            </li>
          </ul>
        </Col>
        <Col span={3}>
          <Title
            level={4}
            style={{ color: "#fff", fontWeight: "bold", fontSize: "18px" }}
          >
            Social Media
          </Title>
          <Row gutter={[16, 16]}>
            <Col>
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#E1306C", fontSize: "28px" }}
              >
                <FaInstagram />
              </Link>
            </Col>
            <Col>
              <Link
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#ff0000", fontSize: "28px" }}
              >
                <FaYoutube />
              </Link>
            </Col>
            <Col>
              <Link
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon"
                style={{ color: "#1DA1F2", fontSize: "28px" }}
              >
                <FaTwitter />
              </Link>
            </Col>
          </Row>
        </Col>
      </Row>
      <Divider
        style={{ marginTop: "30px", marginBottom: "16px", borderColor: "#fff" }}
      />
      <Text style={{ fontSize: "14px", color: "#fff" }}>
        © {new Date().getFullYear()} TopDish. All rights reserved.
      </Text>
    </Footer>
  );
};

export default AppFooter;
