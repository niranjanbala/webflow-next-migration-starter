'use client';

import { useState } from 'react';
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Badge,
  Avatar,
  AvatarGroup,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalContent,
  ModalFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownLabel,
  ToastProvider,
  useToast,
  Loading
} from '@/components/ui';
import { PricingCard } from '@/components/business';

function ComponentsDemo() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { addToast } = useToast();

  const showToast = (variant: 'success' | 'error' | 'warning' | 'info') => {
    addToast({
      title: `${variant.charAt(0).toUpperCase() + variant.slice(1)} Toast`,
      description: `This is a ${variant} toast message.`,
      variant
    });
  };

  const mockAvatars = [
    { alt: 'John Doe', src: '/api/placeholder/40/40' },
    { alt: 'Jane Smith', src: '/api/placeholder/40/40' },
    { alt: 'Bob Johnson', src: '/api/placeholder/40/40' },
    { alt: 'Alice Brown', src: '/api/placeholder/40/40' },
    { alt: 'Charlie Wilson', src: '/api/placeholder/40/40' },
    { alt: 'Diana Davis', src: '/api/placeholder/40/40' }
  ];

  const pricingFeatures = [
    { name: 'Up to 10 users', included: true },
    { name: 'Basic support', included: true },
    { name: 'Advanced analytics', included: false },
    { name: 'Priority support', included: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            UI Components Demo
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive showcase of our reusable UI component library
          </p>
        </div>

        <Tabs defaultValue="buttons" className="space-y-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="data">Data Display</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
          </TabsList>

          <TabsContent value="buttons" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Various button styles and states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Variants</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Sizes</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">States</h3>
                  <div className="flex flex-wrap gap-4">
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button loading>Loading</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="forms" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Form Components</CardTitle>
                <CardDescription>
                  Input fields and form elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Default Input"
                    placeholder="Enter text..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Input
                    label="Required Field"
                    placeholder="Required field"
                    required
                    helperText="This field is required"
                  />
                  <Input
                    label="Error State"
                    placeholder="Invalid input"
                    error="This field has an error"
                  />
                  <Input
                    label="Disabled Input"
                    placeholder="Disabled"
                    disabled
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Input Variants</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input variant="default" placeholder="Default" />
                    <Input variant="filled" placeholder="Filled" />
                    <Input variant="outlined" placeholder="Outlined" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Input Sizes</h3>
                  <div className="space-y-3">
                    <Input size="sm" placeholder="Small input" />
                    <Input size="md" placeholder="Medium input" />
                    <Input size="lg" placeholder="Large input" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cards" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>
                    This is a default card with standard styling
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Card content goes here. This is a simple card layout.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Action
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="elevated" hover>
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>
                    This card has elevation and hover effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Hover over this card to see the animation effect.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="primary" className="w-full">
                    Hover Me
                  </Button>
                </CardFooter>
              </Card>

              <Card variant="outlined">
                <CardHeader>
                  <CardTitle>Outlined Card</CardTitle>
                  <CardDescription>
                    This card has a prominent border
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    The outlined variant provides clear boundaries.
                  </p>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Display Components</CardTitle>
                <CardDescription>
                  Badges, avatars, and other data display elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                    <Badge variant="info">Info</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Badge Sizes</h3>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge size="sm">Small</Badge>
                    <Badge size="md">Medium</Badge>
                    <Badge size="lg">Large</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Avatars</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Avatar size="xs" alt="XS Avatar" />
                    <Avatar size="sm" alt="SM Avatar" />
                    <Avatar size="md" alt="MD Avatar" />
                    <Avatar size="lg" alt="LG Avatar" />
                    <Avatar size="xl" alt="XL Avatar" />
                    <Avatar size="2xl" alt="2XL Avatar" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Avatar Group</h3>
                  <AvatarGroup avatars={mockAvatars} max={4} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Feedback Components</CardTitle>
                <CardDescription>
                  Modals, toasts, and loading states
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Modal</h3>
                  <Button onClick={() => setIsModalOpen(true)}>
                    Open Modal
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Toast Notifications</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('success')}
                    >
                      Success Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('error')}
                    >
                      Error Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('warning')}
                    >
                      Warning Toast
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => showToast('info')}
                    >
                      Info Toast
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Loading States</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    <Loading size="sm" />
                    <Loading size="md" />
                    <Loading size="lg" />
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dropdown</h3>
                  <Dropdown
                    trigger={
                      <Button variant="outline">
                        Open Dropdown
                      </Button>
                    }
                  >
                    <DropdownLabel>Actions</DropdownLabel>
                    <DropdownItem onClick={() => alert('Edit clicked')}>
                      Edit
                    </DropdownItem>
                    <DropdownItem onClick={() => alert('Duplicate clicked')}>
                      Duplicate
                    </DropdownItem>
                    <DropdownSeparator />
                    <DropdownItem onClick={() => alert('Delete clicked')}>
                      Delete
                    </DropdownItem>
                  </Dropdown>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="business" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <PricingCard
                title="Starter"
                description="Perfect for small teams"
                price={{ amount: 29, currency: '$', period: 'month' }}
                features={pricingFeatures}
                ctaText="Get Started"
                ctaHref="/signup"
              />
              
              <PricingCard
                title="Professional"
                description="Best for growing businesses"
                price={{ amount: 99, currency: '$', period: 'month' }}
                features={[
                  { name: 'Up to 50 users', included: true },
                  { name: 'Priority support', included: true },
                  { name: 'Advanced analytics', included: true },
                  { name: 'Custom integrations', included: false }
                ]}
                ctaText="Upgrade Now"
                ctaHref="/upgrade"
                popular
              />
              
              <PricingCard
                title="Enterprise"
                description="For large organizations"
                price={{ amount: 299, currency: '$', period: 'month' }}
                features={[
                  { name: 'Unlimited users', included: true },
                  { name: '24/7 support', included: true },
                  { name: 'Advanced analytics', included: true },
                  { name: 'Custom integrations', included: true }
                ]}
                ctaText="Contact Sales"
                ctaHref="/contact"
              />
            </div>
          </TabsContent>
        </Tabs>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          size="md"
        >
          <ModalHeader onClose={() => setIsModalOpen(false)}>
            <ModalTitle>Example Modal</ModalTitle>
          </ModalHeader>
          <ModalContent>
            <p className="text-gray-600">
              This is an example modal dialog. You can put any content here,
              including forms, images, or other components.
            </p>
            <div className="mt-4">
              <Input
                label="Example Input"
                placeholder="Type something..."
              />
            </div>
          </ModalContent>
          <ModalFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary"
              onClick={() => {
                addToast({
                  title: 'Success!',
                  description: 'Modal action completed.',
                  variant: 'success'
                });
                setIsModalOpen(false);
              }}
            >
              Save Changes
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    </div>
  );
}

export default function ComponentsDemoPage() {
  return (
    <ToastProvider>
      <ComponentsDemo />
    </ToastProvider>
  );
}