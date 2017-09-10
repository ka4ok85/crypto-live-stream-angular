import { CryptoLiveStreamAngularPage } from './app.po';

describe('crypto-live-stream-angular App', () => {
  let page: CryptoLiveStreamAngularPage;

  beforeEach(() => {
    page = new CryptoLiveStreamAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
