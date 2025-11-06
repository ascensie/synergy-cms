import React from 'react'
import {
  Users,
  Image,
  FileText,
  Package,
  UsersRound,
  MessageSquareQuote,
  Sparkles,
  CreditCard,
  HelpCircle,
  Briefcase,
  Plug,
  Award,
} from 'lucide-react'

const iconStyle = {
  width: '20px',
  height: '20px',
  marginRight: '8px',
}

export const UsersIcon = () => <Users style={iconStyle} />
export const MediaIcon = () => <Image style={iconStyle} />
export const BlogIcon = () => <FileText style={iconStyle} />
export const ProductsIcon = () => <Package style={iconStyle} />
export const TeamIcon = () => <UsersRound style={iconStyle} />
export const TestimonialsIcon = () => <MessageSquareQuote style={iconStyle} />
export const FeaturesIcon = () => <Sparkles style={iconStyle} />
export const PricingIcon = () => <CreditCard style={iconStyle} />
export const FAQIcon = () => <HelpCircle style={iconStyle} />
export const ServicesIcon = () => <Briefcase style={iconStyle} />
export const IntegrationsIcon = () => <Plug style={iconStyle} />
export const BrandsIcon = () => <Award style={iconStyle} />
