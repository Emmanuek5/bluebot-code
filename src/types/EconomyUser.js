class EconomyUser {
  constructor() {
    this.id = "";
    this.Wallet = 0;
    this.Bank = 0;
    this.total = this.Bank + this.Wallet;
    this.inventory = [
      { userId: "", itemId: "", name: "", amount: 1000, price: 0 },
      { userId: "", itemId: "", name: "", amount: 1000, price: 0 },
    ];
    this.MongoData = {
      Wallet: 0,
      Bank: 0,
      save: () => {},
    };
  }

  save() {
    this.MongoData.Bank = this.Bank;
    this.MongoData.Wallet = this.Wallet;
    this.MongoData.save();
  }
}

module.exports = EconomyUser;
