import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './User';
import { ForexPair } from './ForexPair';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.alerts)
  user: User;

  @ManyToOne(() => ForexPair)
  forexPair: ForexPair;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 5 })
  triggerPrice: number;

  @Column({ type: 'enum', enum: ['ABOVE', 'BELOW', 'EQUALS'] })
  triggerCondition: 'ABOVE' | 'BELOW' | 'EQUALS';

  @Column({ type: 'enum', enum: ['VOLATILITY_HIGH', 'VOLATILITY_LOW', 'PRICE_MOVEMENT'], default: 'PRICE_MOVEMENT' })
  alertType: 'VOLATILITY_HIGH' | 'VOLATILITY_LOW' | 'PRICE_MOVEMENT';

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  volatilityThreshold: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isTriggered: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  triggeredAt: Date;
}
