describe('Testovací úkol', function () {

  beforeEach(() => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false; // Ignorujeme chyby aplikace
    });
  });

  it('Vytvoření účtu', function () {


    cy.visit('https://www.smartsupp.com/');

    // Přijmout soubory cookie
    cy.get('[data-testid="CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll"]').click();
    cy.get('.c-hero-homepage-2026__cta-primary').click();

    cy.url().should('include', 'openid.smartsupp.com');

    // Registrace (nutná pro ověření prvního vytvoření bota)
    cy.origin('https://openid.smartsupp.com', () => {
      cy.get('[data-testid="signup-user.attributes.fullname"]').type('Eddie Super Tester');

      const email = `test_${Date.now()}@mail.com`;
      cy.get('[data-testid="signup-email"]').type(email);
      cy.get('[data-testid="signup-password"]').type('123321');

      cy.pause(); // Pauza pro vyplnění captcha
    });

    //  Přechod na mikroslužbu app.smartsupp.com. Pro spuštění automatického testu je třeba kliknout na tlačítko „Play“. 
    cy.origin('https://app.smartsupp.com', () => {

      cy.url().should('include', 'app.smartsupp.com');

      // Začátek onboardingu
      cy.contains('div', 'Mira AI for your website').should('be.visible').click();
      cy.contains('button', "Let's get started!").should('be.visible').click();

      // Pokračování v onboardingu AI (nastavení bota)

      cy.get('[data-testid="ai-onboarding-primary-button"]').click();
      cy.get('[data-testid="ai-onboarding-survey-option-eshop"]').click();
      cy.get('[data-testid="ai-onboarding-primary-button"]').click();

      cy.get('[data-testid="ai-onboarding-input-web-url"]').type('example.com');
      cy.contains('button', 'Retrieve pages').click();

      cy.get('[data-testid="ai-onboarding-primary-button"]').click();

      cy.get('[data-testid="ai-onboarding-skip-feed-button"]').click();
      cy.get('[data-testid="ai-onboarding-skip-feed-confirm-button"]').click();

      cy.get('[data-testid="chatbot-identity-modal-name-input"]').type('Roxy');
      cy.get('img[src*="avatars/2.webp"]').parent('[role="button"]').click();
      cy.get('[data-testid="ai-onboarding-primary-button"]').click();



      cy.get('[data-testid="ai-onboarding-primary-button"]').click();



      // Posuvníky 
      cy.contains('span', 'Friendly').click({ force: true });    // 1 úprava
      cy.contains('span', 'Average').click({ force: true });    // 2 úprava
      cy.contains('span', 'Hyper confident').click({ force: true });    // 3 úprava
      cy.contains('span', 'Emoji blast').click({ force: true });    // 4 úprava

      cy.get('[data-testid="chatbot-workflow-form-continue-btn"]').click();
      cy.get('[data-testid="chatbot-workflow-form-continue-btn"]').click();

      // Vlastní uvítací zpráva 5 úprava
      cy.contains('div', 'Custom Welcome message')
        .should('be.visible')
        .click();

      cy.get('textarea[name="welcomeMessage.customMessage"]')
        .clear()
        .type('Welcome from Roxy, the AI bot');

      cy.get('[data-testid="chatbot-workflow-form-continue-btn"]').click();
      cy.get('[data-testid="chatbot-workflow-form-continue-btn"]').click();

      // Publikace
      cy.get('[data-testid="chatbot-workflow-form-publish-btn"]').last().click();

      // Modální okno (potvrzení)
      cy.get('[data-testid="confirm-modal-cancel"]').click();

      // Smazání bota
      cy.get('[data-testid="chatbot-builder-dropdown-toggler"]').click();
      cy.get('[data-testid="chatbot-builder-dropdown-remove"]').click();
      cy.get('[data-testid="delete-modal-confirm"]').click();
    });


  });
}); 