import { CountryCode } from 'src/countryCodes/entities/country-code.entity';
import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Policy, PolicyType } from 'src/policies/entities/policy.entity';
import { Onboarding } from 'src/onboardings/entities/onboarding.entity';
import { OnboardingStep } from 'src/onboardingSteps/entities/onboarding-step.entity';
import { Study } from 'src/studies/entities/study.entity';
import { Form } from 'src/forms/entities/form.entity';
import { FieldType } from 'src/forms/types/fields/field.type';
import { mapFormFields } from 'src/forms/mappers/form-fields.mapper';
import { TextFieldDto } from 'src/forms/dtos/text-field.dto';
import { DropDownFieldDto } from 'src/forms/dtos/drop-down-field.dto';
import { ApiKey } from 'src/auth/entities/api-key.entity';
import { randomUuidv4 } from 'src/utils/generate-uuid';
import { MobilePlatform } from 'src/interceptors/request-context.interceptor';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ApiKey,
      CountryCode,
      Policy,
      Onboarding,
      OnboardingStep,
      Study,
      Form,
    ]),
  ],
})
export class SeedersModule {
  private readonly logger = new Logger(SeedersModule.name);

  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
    @InjectRepository(CountryCode)
    private readonly countryCodeRepository: Repository<CountryCode>,
    @InjectRepository(Policy)
    private readonly policyRepository: Repository<Policy>,
    @InjectRepository(Onboarding)
    private readonly onboardingRepository: Repository<Onboarding>,
    @InjectRepository(OnboardingStep)
    private readonly onboardingStepRepository: Repository<OnboardingStep>,
    @InjectRepository(Form)
    private readonly formRepository: Repository<Form>,
    @InjectRepository(Study)
    private readonly studyRepository: Repository<Study>,
  ) {}

  async onModuleInit() {
    try {
      if (!process.env.SEED) {
        return;
      }
      await this.seedApiKeys();

      const seederKey = await this.apiKeyRepository.findOne({
        where: {
          appName: 'Seeder',
        },
      });

      if (!seederKey) {
        return;
      }
      // TODO: Verify the validity of these country codes
      await this.seedCountryCodes(seederKey);

      if (process.env.NODE_ENV === 'production') {
        return;
      }

      this.logger.warn(
        ' Seeding test data, should only be done in development or testing NOT in production',
      );
      await this.seedPolicies(seederKey);
      const onboarding = await this.seedOnboardings(seederKey);
      await this.seedStudies(seederKey, onboarding);
    } catch (error) {
      this.logger.error('Something went wrong while seeding', error.message);
    }
  }

  async seedApiKeys() {
    const apiKeysCount = await this.apiKeyRepository.count();
    if (apiKeysCount > 0) {
      return;
    }

    const androidAppKey = randomUuidv4();
    const iosAppKey = randomUuidv4();
    const qaTestingAppKey = randomUuidv4();
    const seederAppKey = randomUuidv4();

    await this.apiKeyRepository.save({
      key: androidAppKey,
      appName: 'Android App',
    });
    await this.apiKeyRepository.save({
      key: iosAppKey,
      appName: 'iOS App',
    });
    await this.apiKeyRepository.save({
      key: qaTestingAppKey,
      appName: 'QA Testing',
    });

    await this.apiKeyRepository.save({
      key: process.env.API_KEY,
      appName: 'Dev Testing',
    });

    await this.apiKeyRepository.save({
      key: seederAppKey,
      appName: 'Seeder',
    });

    return {
      androidAppKey,
      iosAppKey,
      qaTestingAppKey,
      seederAppKey,
    };
  }

  async seedCountryCodes(seederKey: ApiKey) {
    const countryCodeCount = await this.countryCodeRepository.count();
    if (countryCodeCount > 0) {
      return;
    }

    for (let i = 0; i < availableCountryCodes.length; i++) {
      const availableCountryCode = availableCountryCodes[i];
      await this.countryCodeRepository.save({
        countryName: availableCountryCode.countryName,
        code: availableCountryCode.countryCode,
        createdBy: seederKey,
      });
    }
  }

  async seedPolicies(seederKey: ApiKey) {
    const countryCodeCount = await this.policyRepository.count();
    if (countryCodeCount > 0) {
      return;
    }

    this.policyRepository.save({
      type: PolicyType.TermsOfService,
      title: 'Terms & Privacy',
      subtitle: '',
      text: policyText,
      createdBy: seederKey,
    });
  }

  async seedOnboardings(seederKey: ApiKey) {
    const onboardingsCount = await this.onboardingRepository.count();
    if (onboardingsCount > 0) {
      return;
    }

    const newOnboarding = await this.onboardingRepository.create({
      name: 'Global Onboarding',
      steps: [],
      form: {},
      createdBy: seederKey,
    });

    for (let i = 0; i < onboardingSteps.length; i++) {
      const onboardingStep = onboardingSteps[i];
      const createdOnboardingStep = await this.onboardingStepRepository.create({
        title: onboardingStep.title,
        subtitle: onboardingStep.subtitle,
        description: onboardingStep.description,
        imageUrl: onboardingStep.imageUrl,
        details: onboardingStep.details,
        order: onboardingStep.order,
        createdBy: seederKey,
        platform: onboardingStep.platform || null,
      });
      const savedOnboardingStep = await this.onboardingStepRepository.save(
        createdOnboardingStep,
      );
      newOnboarding.steps.push(savedOnboardingStep);
    }

    const mappedFields = mapFormFields([
      {
        type: FieldType.TextField,
        isRequired: false,
        description:
          'If you would like to receive updates on this study and hear about future studies, please share your email address.',
        label: 'Sign up for email updates',
        placeholder: 'Your e-mail (optional)',
        multiline: false,
        maxLines: 1,
      } as TextFieldDto,
    ]);

    const createdForm = await this.formRepository.create({
      name: 'Sign Up Form',
      fields: mappedFields,
      createdBy: seederKey,
    });

    const savedForm = await this.formRepository.save(createdForm);

    newOnboarding.form = savedForm;

    return await this.onboardingRepository.save(newOnboarding);
  }

  async seedStudies(seederKey: ApiKey, onboarding: Onboarding) {
    const studyCount = await this.studyRepository.count();
    if (studyCount > 0) {
      return;
    }

    // const countryCodes = await this.countryCodeRepository.find({
    //   where: { code: 'us' },
    // });

    const reportMappedFields = mapFormFields([
      {
        type: FieldType.TextField,
        isRequired: true,
        label: 'TikTok URL',
        description:
          'Copy and paste the link to a TikTok video you consider harmful.',
        placeholder: 'https://tiktok.com/...',
        multiline: false,
        maxLines: 1,
        isTikTokLink: true,
      } as TextFieldDto,
      {
        type: FieldType.DropDown,
        isRequired: true,
        label: 'Category',
        description: 'Please select a category',
        placeholder: 'Category',
        options: [
          { title: 'Distressing or disturbing' },
          { title: 'Promotes violence or harm' },
          {
            title: 'Promotes misleading health information',
          },
          { title: 'Infringes on my privacy' },
          { title: 'Spam and/or posted by bot' },
          { title: 'May be a disinformation campaign' },
          { title: 'Harasses a group or individual' },
          { title: 'Political viewpoint I want to see less of' },
          { title: 'Stereotypes a group of people' },
          { title: "Don't feel represented by this video" },
        ],
        selected: 'Distressing or disturbing',
        hasOtherOption: true,
      } as DropDownFieldDto,
      {
        type: FieldType.TextField,
        isRequired: true,
        label: 'Comments',
        description: 'Tell us why you think this video is harmful to you.',
        placeholder: 'Your comment here',
        multiline: true,
        maxLines: 8,
      } as TextFieldDto,
    ]);

    const reportForm = await this.formRepository.create({
      name: 'Global Study Form',
      fields: reportMappedFields,
      createdBy: seederKey,
    });

    const savedReportForm = await this.formRepository.save(reportForm);

    const dataFormFields = mapFormFields([
      {
        type: FieldType.TextField,
        isRequired: true,
        description:
          'Please provide your email address in order to get a copy of your data',
        label: 'Email address',
        placeholder: 'Your e-mail',
        multiline: false,
        maxLines: 1,
      } as TextFieldDto,
    ]);

    const dataDownloadForm = await this.formRepository.create({
      name: 'Data Download Form',
      fields: dataFormFields,
      createdBy: seederKey,
    });

    const savedDataDownloadForm =
      await this.formRepository.save(dataDownloadForm);

    return await this.studyRepository.save({
      name: 'Global Study',
      description: 'Our main study.',
      isActive: true,
      supportsRecording: true,
      policies: [],
      onboarding,
      form: savedReportForm,
      dataDownloadForm: savedDataDownloadForm,
      createdBy: seederKey,
    });
  }
}

const onboardingSteps = [
  {
    title: 'How to share a TikTok video',
    subtitle: 'Sharing a link',
    description: "Tap TikTok's share button.",
    details: '',
    order: 1,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/How-to-share.gif',
    platform: MobilePlatform.IOS,
  },
  {
    title: 'How to share a screen recording',
    subtitle: 'Record your session on TikTok',
    description:
      'Open the FYP Reporter app and go to the ‘Record a Session’ tab. Tap ‘Record my TikTok session’ to start screen recording.',
    details: '',
    order: 2,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/Record-session.gif',
    platform: MobilePlatform.IOS,
  },
  {
    title: 'How to share a screen recording',
    subtitle: 'Record your session on TikTok',
    description:
      'Add some information about the recording if you want. Tap the ‘Trim recording’ button to trim the video, then tap ‘Submit Report’ to submit the recording.',
    details: '',
    order: 3,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/Onboarding%20image%20-%20recording%20-%20step%203.png',
    platform: MobilePlatform.IOS,
  },
  {
    title: 'How to share a TikTok video',
    subtitle: 'Sharing a link',
    description: "Tap TikTok's share button.",
    details: '',
    order: 4,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/Android-share.gif',
    platform: MobilePlatform.ANDROID,
  },
  {
    title: 'How to share a screen recording',
    subtitle: 'Record your session on TikTok',
    description:
      'Open the FYP Reporter app and go to the ‘Record a Session’ tab. Tap ‘Record my TikTok session’ to start screen recording.',
    details: '',
    order: 5,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/Android-record.gif',
    platform: MobilePlatform.ANDROID,
  },
  {
    title: 'How to share a screen recording',
    subtitle: 'Record your session on TikTok',
    description:
      'Add some information about the recording if you want. Tap the ‘Trim recording’ button to trim the video, then tap ‘Submit Report’ to submit the recording.',
    details: '',
    order: 6,
    imageUrl:
      'https://storage.googleapis.com/ttreporter_onboarding/Android-Onboarding%20image%20-%20recording%20-%20step%203.png',
    platform: MobilePlatform.ANDROID,
  },
];

const policyText = `Your use of FYP Reporter is subject to our [Terms of Service](https://foundation.mozilla.org/en/fyp-reporter/terms-of-service/
) and [Privacy Notice](https://foundation.mozilla.org/en/fyp-reporter/privacy-notice/) ("Terms"). Please read these Terms carefully before using the app. By clicking "I Agree" below, you agree to be bound by these Terms.`;


const availableCountryCodes = [
  { countryName: 'Afghanistan', countryCode: 'af' },
  { countryName: 'Algeria', countryCode: 'dz' },
  { countryName: 'Angola', countryCode: 'ao' },
  { countryName: 'Argentina', countryCode: 'ar' },
  { countryName: 'Australia', countryCode: 'au' },
  { countryName: 'Austria', countryCode: 'at' },
  { countryName: 'Bangladesh', countryCode: 'bd' },
  { countryName: 'Belarus', countryCode: 'by' },
  { countryName: 'Belgium', countryCode: 'be' },
  { countryName: 'Bolivia', countryCode: 'bo' },
  { countryName: 'Bosnia And Herzegovina', countryCode: 'ba' },
  { countryName: 'Botswana', countryCode: 'bw' },
  { countryName: 'Brazil', countryCode: 'br' },
  { countryName: 'Bulgaria', countryCode: 'bg' },
  { countryName: 'Cambodia', countryCode: 'kh' },
  { countryName: 'Cameroon', countryCode: 'cm' },
  { countryName: 'Canada', countryCode: 'ca' },
  { countryName: 'Chile', countryCode: 'cl' },
  { countryName: 'China', countryCode: 'cn' },
  { countryName: 'Colombia', countryCode: 'co' },
  { countryName: 'Congo, The Democratic Republic Of The', countryCode: 'cd' },
  { countryName: 'Costa Rica', countryCode: 'cr' },
  { countryName: "Cote D'ivoire", countryCode: 'ci' },
  { countryName: 'Croatia', countryCode: 'hr' },
  { countryName: 'Cyprus', countryCode: 'cy' },
  { countryName: 'Czech Republic', countryCode: 'cz' },
  { countryName: 'Denmark', countryCode: 'dk' },
  { countryName: 'Dominican Republic', countryCode: 'do' },
  { countryName: 'Ecuador', countryCode: 'ec' },
  { countryName: 'Egypt', countryCode: 'eg' },
  { countryName: 'El Salvador', countryCode: 'sv' },
  { countryName: 'Estonia', countryCode: 'ee' },
  { countryName: 'Finland', countryCode: 'fi' },
  { countryName: 'France', countryCode: 'fr' },
  { countryName: 'Gabon', countryCode: 'ga' },
  { countryName: 'Georgia', countryCode: 'ge' },
  { countryName: 'Germany', countryCode: 'de' },
  { countryName: 'Greece', countryCode: 'gr' },
  { countryName: 'Guatemala', countryCode: 'gt' },
  { countryName: 'Honduras', countryCode: 'hn' },
  { countryName: 'Hong Kong', countryCode: 'hk' },
  { countryName: 'Hungary', countryCode: 'hu' },
  { countryName: 'Iceland', countryCode: 'is' },
  { countryName: 'India', countryCode: 'in' },
  { countryName: 'Indonesia', countryCode: 'id' },
  { countryName: 'Iran, Islamic Republic Of', countryCode: 'ir' },
  { countryName: 'Iraq', countryCode: 'iq' },
  { countryName: 'Ireland', countryCode: 'ie' },
  { countryName: 'Israel', countryCode: 'il' },
  { countryName: 'Italy', countryCode: 'it' },
  { countryName: 'Japan', countryCode: 'jp' },
  { countryName: 'Jordan', countryCode: 'jo' },
  { countryName: 'Kazakstan', countryCode: 'kz' },
  { countryName: 'Kenya', countryCode: 'ke' },
  { countryName: 'Korea, Republic Of', countryCode: 'kr' },
  { countryName: 'Kuwait', countryCode: 'kw' },
  { countryName: "Lao People's Democratic Republic", countryCode: 'la' },
  { countryName: 'Latvia', countryCode: 'lv' },
  { countryName: 'Lebanon', countryCode: 'lb' },
  { countryName: 'Libyan Arab Jamahiriya', countryCode: 'ly' },
  { countryName: 'Lithuania', countryCode: 'lt' },
  { countryName: 'Luxembourg', countryCode: 'lu' },
  { countryName: 'Macau', countryCode: 'mo' },
  { countryName: 'Malawi', countryCode: 'mw' },
  { countryName: 'Malaysia', countryCode: 'my' },
  { countryName: 'Maldives', countryCode: 'mv' },
  { countryName: 'Mexico', countryCode: 'mx' },
  { countryName: 'Montenegro', countryCode: 'me' },
  { countryName: 'Morocco', countryCode: 'ma' },
  { countryName: 'Myanmar', countryCode: 'mm' },
  { countryName: 'Nauru', countryCode: 'nr' },
  { countryName: 'Netherlands', countryCode: 'nl' },
  { countryName: 'New Zealand', countryCode: 'nz' },
  { countryName: 'Nicaragua', countryCode: 'ni' },
  { countryName: 'Nigeria', countryCode: 'ng' },
  { countryName: 'Norway', countryCode: 'no' },
  { countryName: 'Oman', countryCode: 'om' },
  { countryName: 'Pakistan', countryCode: 'pk' },
  { countryName: 'Panama', countryCode: 'pa' },
  { countryName: 'Paraguay', countryCode: 'py' },
  { countryName: 'Peru', countryCode: 'pe' },
  { countryName: 'Philippines', countryCode: 'ph' },
  { countryName: 'Poland', countryCode: 'pl' },
  { countryName: 'Portugal', countryCode: 'pt' },
  { countryName: 'Qatar', countryCode: 'qa' },
  { countryName: 'Romania', countryCode: 'ro' },
  { countryName: 'Russian Federation', countryCode: 'ru' },
  { countryName: 'Rwanda', countryCode: 'rw' },
  { countryName: 'Saudi Arabia', countryCode: 'sa' },
  { countryName: 'Senegal', countryCode: 'sn' },
  { countryName: 'Serbia', countryCode: 'rs' },
  { countryName: 'Singapore', countryCode: 'sg' },
  { countryName: 'Slovakia', countryCode: 'sk' },
  { countryName: 'Slovenia', countryCode: 'si' },
  { countryName: 'South Africa', countryCode: 'za' },
  { countryName: 'Spain', countryCode: 'es' },
  { countryName: 'Sri', countryCode: 'lk' },
  { countryName: 'Sweden', countryCode: 'se' },
  { countryName: 'Switzerland', countryCode: 'ch' },
  { countryName: 'Taiwan, Province Of China', countryCode: 'tw' },
  { countryName: 'Tanzania', countryCode: 'tz' },
  { countryName: 'Thailand', countryCode: 'th' },
  { countryName: 'The Republic of Kosovo', countryCode: 'xk' },
  { countryName: 'Tonga', countryCode: 'to' },
  { countryName: 'Tunisia', countryCode: 'tn' },
  { countryName: 'Turkey', countryCode: 'tr' },
  { countryName: 'Uganda', countryCode: 'ug' },
  { countryName: 'Ukraine', countryCode: 'ua' },
  { countryName: 'United Arab Emirates', countryCode: 'ae' },
  { countryName: 'United Kingdom', countryCode: 'gb' },
  { countryName: 'United States', countryCode: 'us' },
  { countryName: 'Uruguay', countryCode: 'uy' },
  { countryName: 'Vanuatu', countryCode: 'vu' },
  { countryName: 'Venezuela', countryCode: 've' },
  { countryName: 'Viet Nam', countryCode: 'vn' },
  { countryName: 'Zambia', countryCode: 'zm' },
  { countryName: 'Zimbabwe', countryCode: 'zw' },
];
