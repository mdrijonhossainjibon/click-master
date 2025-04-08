/* import { NextResponse } from 'next/server';


export async function GET() {
  try {
    // Fetch all settings
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ['bot_config', 'smtp_config', 'site_config', 'notification_config']
        }
      }
    });

    // Convert array to object with key-value pairs
    const settingsObject = settings.reduce((acc: Record<string, any>, setting: { key: string; value: string }) => {
      acc[setting.key] = setting;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(settingsObject);
  } catch (error) {
    console.error('Error loading settings:', error);
    return NextResponse.json(
      { error: 'Failed to load settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const settings = await request.json();

    // Save bot settings
    await prisma.setting.upsert({
      where: { key: 'bot_config' },
      update: { value: JSON.stringify(settings.bot) },
      create: {
        key: 'bot_config',
        value: JSON.stringify(settings.bot)
      }
    });

    // Save SMTP settings
    await prisma.setting.upsert({
      where: { key: 'smtp_config' },
      update: { value: JSON.stringify(settings.smtp) },
      create: {
        key: 'smtp_config',
        value: JSON.stringify(settings.smtp)
      }
    });

    // Save site settings
    await prisma.setting.upsert({
      where: { key: 'site_config' },
      update: { value: JSON.stringify(settings.site) },
      create: {
        key: 'site_config',
        value: JSON.stringify(settings.site)
      }
    });

    // Save notification settings
    await prisma.setting.upsert({
      where: { key: 'notification_config' },
      update: { value: JSON.stringify(settings.notifications) },
      create: {
        key: 'notification_config',
        value: JSON.stringify(settings.notifications)
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
 */