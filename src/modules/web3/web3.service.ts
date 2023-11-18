import EscrowAbi from '@/abis/Escrow.json';
import StakeAbi from '@/abis/Staking.json';
import { ConfigService } from '@nestjs/config';
import { HttpException, Injectable } from '@nestjs/common';
import EscrowFactoryAbi from '@/abis/EscrowFactory.json';
const Web3 = require('web3');

@Injectable()
export class Web3Service {
  constructor(private readonly configService: ConfigService) {}

  async connectionChain(url: string): Promise<any> {
    try {
      const connection = new Web3(url);
      // Test the connection
      await connection.eth
        .getBlockNumber()
        .then(console.log)
        .catch(console.error);

      return connection;
    } catch (err) {
      throw new HttpException('Error connecting to web3', err);
    }
  }

  async createStake(web3: any, stakeAddress: string): Promise<any> {
    const stakeContract = new web3.eth.Contract(StakeAbi, stakeAddress);
    return stakeContract;
  }

  async getAccount(web3: any): Promise<string> {
    const account = web3.eth.accounts.privateKeyToAccount(
      this.configService.get('PRIVATE_KEY'),
    );

    return account.address;
  }

  async createEscrowFactory(
    web3: any,
    escrowFactoryAddress: string,
  ): Promise<any> {
    const escrowFactory = new web3.eth.Contract(
      EscrowFactoryAbi,
      escrowFactoryAddress,
    );
    return escrowFactory;
  }

  // async tokenContract(): Promise<any> {
  //   const token = new web3.eth.Contract(USDCTokenAbi, addresses.hmt);

  //   return token;
  // }

  async getEscrow(web3: any, address: string): Promise<any> {
    const Escrow = new web3.eth.Contract(EscrowAbi, address);
    return Escrow;
  }
}
