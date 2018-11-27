import { getRepository } from 'typeorm-expo/browser';

import { TransferLogModel } from '../db';

export default class TransferLogService {
  static async getTransferLogsByAcocuntId(accountId) {
    const TransferLogRepo = getRepository(TransferLogModel);
    const transferLogs = await TransferLogRepo.find({ accountId });

    return transferLogs;
  }

  static async addTransferLog(transferInfo) {
    const TransferLogRepo = getRepository(TransferLogModel);

    const newTransferLog = new TransferLogModel({
      ...transferInfo
    });

    // save
    await TransferLogRepo.save(newTransferLog);

    return newTransferLog;
  }
}
