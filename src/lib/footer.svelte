<script>
    import Icon from "@iconify/svelte";
  </script>
  
  <div class="footer">
    <div class="top">
      <div class="infoparagraph">
        <div class="store">Cloyta</div>
        <div class="exp">
          Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas
          accumsan lacus vel facilisis in termapol.
        </div>
        <div class="phone">0715067768 - lawrencemunenex@gmail.com</div>
      </div>
      <div class="links">
        <div class="info">
          <div class="samplehead"><b>Information</b></div>
          <div class="sample"><a href="/about">About</a></div>
          <div class="sample"><a href="/returnpolicy">Returns policy </a></div>
        </div>
        <div class="account">
          <div class="samplehead"><b>Account</b></div>
          <div class="sample"><a href="/account">Account</a></div>
          <div class="sample"><a href="/checkout">Checkout</a></div>
          <div class="sample"><a href="/dashboard">Dashboard</a></div>
          <div class="sample"><a href="/wishlist">My wishlist </a></div>
        </div>
        <div class="socialmedia">
          <div class="samplehead"><b>Socialmedia</b></div>
          <div class="sample">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="devicon:linkedin" />
              <span>Cloyta LinkedIn</span>
            </a>
          </div>
          <div class="sample">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="logos:facebook" />
              <span>Cloyta Facebook</span>
            </a>
          </div>
  
          <div class="sample">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="skill-icons:instagram" />
              <span>Cloyta Instagram</span>
            </a>
          </div>
          <div class="sample">
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon="logos:whatsapp-icon" />
              <span>Cloyta WhatsApp</span>
            </a>
          </div>
        </div>
        <div class="shop">
          <div class="samplehead"><b>Shop</b></div>
          <div class="sample"><a href="/men">Men</a></div>
          <div class="sample"><a href="/shop">Shop</a></div>
          <div class="sample"><a href="/shoes">Shoes</a></div>
          <div class="sample"><a href="/women">Women</a></div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <i>Copyright 2024 .Cloyta store. All rights reserved.</i>
    </div>
  </div>
  
  <style>
    .footer {
      height: 260px;
      display: flex;
      flex-direction: column;
    }
    .top {
      flex-basis: 95%;
      flex-grow: 0;
      border-bottom: 2px solid rgba(128, 128, 128, 0.2);
      display: flex;
      flex-direction: row;
      padding: 0 13px;
      align-items: center;
    }
    .bottom {
      flex-basis: 5%;
      flex-grow: 0;
    }
    .infoparagraph {
      flex: 0 0 24%;
      display: flex;
      flex-direction: column;
    }
    .store {
      font-weight: 700;
      font-size: 36px;
    }
    .exp,
    .phone {
      font-size: 14px;
      font-weight: 400;
      line-height: 21px;
      margin-top: 15px;
    }
    .links {
      flex: 0 0 76%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
    }
    .info,
    .account,
    .socialmedia,
    .shop {
      flex-direction: column;
      font-size: 16px;
      font-weight: 400;
      line-height: 24px;
    }
    .info a,
    .account a,
    .socialmedia a,
    .shop a {
      text-decoration: none;
      outline: none;
      color: black;
    }
    .sample {
      margin-top: 4px;
    }
    .bottom {
      display: flex;
      justify-content: center;
      font-size: 14px;
      margin-top: 8px;
    }
    @media (max-width: 768px) {
      .footer {
        height: auto;
      }
      .top {
        flex-direction: column;
        align-items: normal;
      }
      .exp{
          width: 75vw;
      }
      .phone{
          margin-top: 25px;
      }
      .links {
        flex-direction: column;
        align-items: none;
      }
      .infoparagraph {
        margin-top: 30px;
      }
      .account,
      .socialmedia,
      .shop {
        margin-top: 30px;
      }
      .shop{
          margin-bottom: 8px;
      }
      .info{
          margin-top: 30px;
      }
      .samplehead {
        margin-bottom: 8px;
      }
      .bottom {
        margin-top: 10px;
        margin-bottom: 4px;
      }
    }
  </style>
  