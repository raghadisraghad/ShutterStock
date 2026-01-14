import React from 'react';
import SearchBar from '../components/SearchBar';
import './home.css';

const Home = () => {
  return (


    <>
    

    
    <div className="home-container">
        <div className="hero-section">
          <div className="hero-overlay">
            <h1 className="hero-title">Explore Morocco Like Never Before</h1>
            <p className="hero-subtitle">
              Discover breathtaking royalty-free images and uncover the magic of Moroccan destinations.
            </p>
            <SearchBar placeholder="Search stunning images, videos, or music" />
          </div>
        </div>

        <div className="why-visit-section">
          <h2 className="section-title">Why Visit Morocco?</h2>
          <p className="why-visit-description">
            Morocco offers unique experiences from the desert to the mountains, blending ancient history with modern culture. Explore vibrant souks, majestic palaces, and breathtaking landscapes.
          </p>
          <div className="why-visit-grid">
            <div className="reason-item">
              <img src="/reasons/adventure.jpg" alt="Adventure" className="reason-image" />
              <h3>Adventure</h3>
            </div>
            <div className="reason-item">
              <img src="/reasons/culture.jpg" alt="Culture" className="reason-image" />
              <h3>Culture</h3>
            </div>
            <div className="reason-item">
              <img src="/reasons/relaxation.jpg" alt="Relaxation" className="reason-image" />
              <h3>Relaxation</h3>
            </div>
          </div>
        </div>


        <br></br><br></br>
        {/* Moroccan Culture Section */}
        <div className="culture-section">
          <h2 className="section-title">Featured Moroccan Photographers</h2>
          <div className="culture-grid">

            <div className="culture-item">
              <img src="/photographers/2.png" alt="Moroccan Crafts" className="culture-image" />
              <div className="culture-text">
                <h3 className="photographer-name">Mohamed Boulaich</h3>
                <p className="culture-description">
                  An experienced audiovisual production specialist based in Tangier, Morocco, offering high-quality video and photography services for events, corporate projects, and creative campaigns. Dedicated to bringing your vision to life with professionalism and expertise. Let’s collaborate to create exceptional content.
                </p>
              </div>
            </div>


            <div className="culture-item">
              <img src="/photographers/1.jpg" alt="Moroccan Festival" className="culture-image" />
              <div className="culture-text">
                <h3 className="photographer-name">Soulaimane Mouali</h3>
                <p className="culture-description">

                  I'm a professional photographer and videographer based in Tangier, Morocco, specializing in events, real estate, video production, and drone services. I create high-quality content that captures moments and tells your unique story. Let's make something unforgettable!
                </p>
              </div>
            </div>

            <div className="culture-item">
              <img src="/photographers/3.jpg" alt="Moroccan Food" className="culture-image" />
              <div className="culture-text">
                <h3 className="photographer-name">Younes Ghazouf</h3>
                <p className="culture-description">
                  I specialize in high-quality nightlife photography and videography, delivering dynamic content that captures the essence of your venue and events. From promotional material to brand storytelling, my tailored audiovisual services are designed to enhance your brand’s presence and engage your audience effectively. Let’s collaborate to elevate your venue and attract more clients.        </p>
              </div>
            </div>
          </div>
        </div>


        {/* Moroccan Cities Section */}
        <div className="moroccan-cities-section">
          <h2 className="section-title">Top Cities to Visit in Morocco</h2>
          <div className="cities-grid">
            {[
              'Tangier', 'Larache', 'Fes', 'Marrakech', 'Agadir', 'Chefchaouen',
              'Essaouira', 'Ifrane', 'Ouarzazate', 'Meknes', 'Nador', 'Merzouga',
              'Casablanca', 'Tétouan', 'Oujda', 'Al-Hoceima', 'Dakhla', 'Rabat'
            ].map((city) => (
              <div className="city-card" key={city}>
                <a href="/images" className="city-image-link">
                  <img src={`/cities/${city.toLowerCase()}.jpg`} alt={city} className="city-image" />
                </a>
                <div className="city-overlay">
                  <h3 className="city-name">{city}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>



        {/* Moroccan Culture Section */}
        <div className="culture-section">
          <h2 className="section-title">Experience the Heart of Moroccan Culture</h2>
          <div className="culture-grid">
            <div className="culture-item">
              <img src="/culture/festival.jpg" alt="Moroccan Festival" className="culture-image" />
              <div className="culture-text">
                <h3 className="culture-title">Festivals & Traditions</h3>
                <p className="culture-description">
                  Moroccan festivals are a vibrant blend of colors, music, and dance, showcasing the country's rich cultural heritage.
                  From the famous Marrakech Festival to local celebrations, each festival offers an unforgettable experience.
                </p>
              </div>
            </div>
            <div className="culture-item">
              <img src="/culture/crafts.jpg" alt="Moroccan Crafts" className="culture-image" />
              <div className="culture-text">
                <h3 className="culture-title">Handicrafts & Art</h3>
                <p className="culture-description">
                  Morocco's artisanal crafts, such as intricate pottery, carpets, and leather goods, reflect centuries of tradition and creativity.
                  Explore the souks and take home a piece of Moroccan craftsmanship.
                </p>
              </div>
            </div>
            <div className="culture-item">
              <img src="/culture/food.jpg" alt="Moroccan Food" className="culture-image" />
              <div className="culture-text">
                <h3 className="culture-title">Delicious Cuisine</h3>
                <p className="culture-description">
                  Moroccan cuisine is a fusion of bold flavors, including tagines, couscous, and mint tea. Enjoy a sensory feast with every bite.
                </p>
              </div>
            </div>
          </div>
        </div>


        {/*
    <div className="attractions-section">
      <h2 className="section-title">Discover Morocco's Top Attractions</h2>
      <div className="attractions-grid">
        {[
          'Sahara Desert', 'Atlas Mountains', 'Hassan II Mosque', 'Majorelle Garden',
          'Djemaa el-Fna', 'Koutoubia Mosque', 'Ait Benhaddou', 'Merzouga Dunes',
          'Todgha Gorge', 'Ouzoud Waterfalls', 'Paradise Valley', 'Chellah Necropolis',
          'Volubilis Ruins', 'Asilah Medina', 'Toubkal National Park', 'Boumalne Dades',
          'Sidi Kaouki', 'Skoura Oasis', 'Imilchil Lakes', 'Rissani Market',
        ].map((attraction) => (
          <div className="attraction-card" key={attraction}>
            <a href="/images" className="city-image-link">
              <img
                src={`/images/${attraction.toLowerCase().replace(/ /g, '-')}.jpg`}
                alt={attraction}
                className="attraction-image"
              />
            </a>
            <h3 className="attraction-name">{attraction}</h3>
          </div>
        ))}
      </div>
    </div>








    Testimonials Section
    <div className="testimonials-section">
      <h2 className="section-title">What Our Clients Say</h2>
      <div className="testimonials-grid">
        <div className="testimonial-card">
          <p className="testimonial-text">"A stunning collection of high-quality images, perfect for my creative projects!"</p>
          <p className="testimonial-author">- Sarah L., Designer</p>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-text">"The best place to find Moroccan images, easy to use, and fast download!"</p>
          <p className="testimonial-author">- David M., Marketing Director</p>
        </div>
        <div className="testimonial-card">
          <p className="testimonial-text">"Incredible diversity in imagery! It truly reflects the rich culture of Morocco."</p>
          <p className="testimonial-author">- Lucia P., Content Creator</p>
        </div>
      </div>
    </div>

*/}

      </div></>
  );
};

export default Home;