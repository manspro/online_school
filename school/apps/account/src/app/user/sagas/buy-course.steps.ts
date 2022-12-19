import { BuyCourseSageState } from "./buy-course.state";
import { UserEntity } from "../entities/user.entity";
import { CourseGetCourse, PaymentCheck, PaymentGenerateLink } from "@school/contracts";
import { PurchaseState } from "@school/interfaces";

export class BuyCourseSagaStateStarted extends BuyCourseSageState {

  public async pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
    const {course} = await this.saga.rmqService.send<CourseGetCourse.Request, CourseGetCourse.Response>(CourseGetCourse.topic, {
      id: this.saga.courseId
    });
    if (!course) {
      throw new Error('Такого курса не существует')
    }
    if (course.price == 0) {
      this.saga.setState(PurchaseState.Purchased, course._id);
      return {paymentLink: null, user: this.saga.user}
    }
    const {paymentLink} = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
      courseId: course._id,
      userId: this.saga.user._id,
      sum: course.price,
    });
    this.saga.setState(PurchaseState.WaitingForPayment, course._id);
    return {paymentLink, user: this.saga.user}
  }

  public async cancel(): Promise<{ user: UserEntity }> {
    this.saga.setState(PurchaseState.Canceled, this.saga.courseId);
    return { user: this.saga.user};
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж');
  }
}

export class BuyCourseSagaStateWaitingForPayments extends BuyCourseSageState {

  async pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Нельзя создать ссылку на оплату в процессе');
  }

  async checkPayment(): Promise<{ user: UserEntity }> {
    const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
      userId: this.saga.user._id,
      courseId: this.saga.courseId
    });
    if (status === 'canceled') {
      this.saga.setState(PurchaseState.Canceled,  this.saga.courseId);
      return { user: this.saga.user}
    }
    if (status !== 'success') {
      return { user: this.saga.user};
    }
    this.saga.setState(PurchaseState.Purchased, this.saga.courseId);
    return { user: this.saga.user}
  }

  async cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить платеж в процессе')
  }
}

export class BuyCourseSagaStatePurchased extends BuyCourseSageState {

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    throw new Error('Нельзя оплатить купленный курс')
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж по купленному курсу')
  }

  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить купленный курс')
  }
}

export class BuyCourseSagaStateCanceled extends BuyCourseSageState {

  pay(): Promise<{ paymentLink: string; user: UserEntity }> {
    this.saga.setState(PurchaseState.Started, this.saga.courseId);
    return this.saga.getState().pay();
  }

  checkPayment(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя проверить платеж по отмененному курсу')
  }

  cancel(): Promise<{ user: UserEntity }> {
    throw new Error('Нельзя отменить отмененный курс')
  }
}













